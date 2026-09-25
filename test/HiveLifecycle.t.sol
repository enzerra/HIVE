// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HiveArena} from "../contracts/HiveArena.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HiveLifecycleTest is Test {
    HiveArena public arena;
    bytes32 public matchId = keccak256("match-lifecycle-001");
    address public operator = address(0x10);
    address public resolver = address(0x20);
    address public purplePlayer = address(0x101);
    address public chogPlayer = address(0x201);

    function setUp() public {
        arena = new HiveArena();

        HiveTypes.RoundDurations memory durations = HiveTypes.RoundDurations({
            think: 20,
            deliberate: 60,
            commit: 15,
            reveal: 10,
            council: 60,
            revision: 20,
            resolve: 5
        });

        arena.createMatch(
            matchId,
            keccak256("roster-lifecycle"),
            keccak256("rules-v1"),
            operator,
            resolver,
            durations
        );

        address[] memory pPlayers = new address[](1);
        pPlayers[0] = purplePlayer;

        address[] memory cPlayers = new address[](1);
        cPlayers[0] = chogPlayer;

        vm.prank(operator);
        arena.setRoster(matchId, pPlayers, cPlayers, purplePlayer, chogPlayer);

        vm.prank(operator);
        arena.startMatch(matchId);
    }

    function test_AllSevenPhasesSequentialAdvancement() public {
        // Round 1 starts at Think
        HiveTypes.RoundState memory r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Think));

        // Revert if non-operator tries to advance before deadline
        address stranger = address(0x999);
        vm.prank(stranger);
        vm.expectRevert(HiveTypes.PhaseClosed.selector);
        arena.advancePhase(matchId);

        // Advance to Deliberate
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Deliberate));

        // Advance to Commit
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Commit));

        // Players commit
        bytes32 pSalt = keccak256("p_salt");
        bytes32 cSalt = keccak256("c_salt");
        bytes32 pCommit = arena.computeCommitmentHash(matchId, 1, purplePlayer, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);
        bytes32 cCommit = arena.computeCommitmentHash(matchId, 1, chogPlayer, HiveTypes.Stage.Initial, HiveTypes.Choice.B, cSalt);

        vm.prank(purplePlayer);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, pCommit);
        vm.prank(chogPlayer);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, cCommit);

        // Advance to Reveal
        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Reveal));

        // Players reveal
        vm.prank(purplePlayer);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);
        vm.prank(chogPlayer);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.B, cSalt);

        // Advance to Council
        vm.warp(block.timestamp + 11);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Council));
        assertEq(r.purple.initialBeliefMicros, 1_000_000);
        assertEq(r.chog.initialBeliefMicros, 0);

        // Advance to Revision
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Revision));

        // Purple explicitly switches to B, Chog explicitly stays on B
        vm.prank(purplePlayer);
        arena.submitRevision(matchId, 1, false, HiveTypes.AttributionKind.InternalDiscussion, bytes32(0));
        vm.prank(chogPlayer);
        arena.submitRevision(matchId, 1, true, HiveTypes.AttributionKind.None, bytes32(0));

        // Advance to Resolve
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);
        r = arena.getRound(matchId, 1);
        assertEq(uint8(r.phase), uint8(HiveTypes.Phase.Resolve));

        // Advance out of Resolve -> should transition to Round 2 Think!
        vm.warp(block.timestamp + 6);
        arena.advancePhase(matchId);

        // Check Round 2 is now in Think
        HiveTypes.RoundState memory r2 = arena.getRound(matchId, 2);
        assertEq(uint8(r2.phase), uint8(HiveTypes.Phase.Think));
    }

    function test_DefaultedStayWhenNoFinalCommitment() public {
        // Move to Commit
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);

        bytes32 pSalt = keccak256("p_salt");
        bytes32 cSalt = keccak256("c_salt");
        bytes32 pCommit = arena.computeCommitmentHash(matchId, 1, purplePlayer, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);
        bytes32 cCommit = arena.computeCommitmentHash(matchId, 1, chogPlayer, HiveTypes.Stage.Initial, HiveTypes.Choice.B, cSalt);

        vm.prank(purplePlayer);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, pCommit);
        vm.prank(chogPlayer);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, cCommit);

        // Move to Reveal and reveal
        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);
        vm.prank(purplePlayer);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);
        vm.prank(chogPlayer);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.B, cSalt);

        // Move to Council then Revision
        vm.warp(block.timestamp + 11);
        arena.advancePhase(matchId);
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);

        // In Revision: neither player submits revision (defaulted Stay)
        // Advance to Resolve
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);

        // Advance out of Resolve to complete tallies
        vm.warp(block.timestamp + 6);
        arena.advancePhase(matchId);

        HiveTypes.RoundState memory r = arena.getRound(matchId, 1);
        // Purple defaulted to Stay (Choice.A = 1_000_000 micros)
        assertEq(r.purple.finalBeliefMicros, 1_000_000);
        assertFalse(r.purple.forfeit);

        // Chog defaulted to Stay (Choice.B = 0 micros)
        assertEq(r.chog.finalBeliefMicros, 0);
        assertFalse(r.chog.forfeit);
    }

    function test_ForfeitWhenMissingInitialReveal() public {
        // Move to Commit
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);

        bytes32 pSalt = keccak256("p_salt");
        bytes32 pCommit = arena.computeCommitmentHash(matchId, 1, purplePlayer, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);

        vm.prank(purplePlayer);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, pCommit);
        // Chog fails to commit!

        // Move to Reveal
        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        vm.prank(purplePlayer);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.A, pSalt);

        // Move to Council (where initial tallies and forfeits are recorded)
        vm.warp(block.timestamp + 11);
        arena.advancePhase(matchId);

        HiveTypes.RoundState memory r = arena.getRound(matchId, 1);
        assertFalse(r.purple.forfeit);
        assertTrue(r.chog.forfeit); // Chog must forfeit because it missed initial commit/reveal!
    }
}
