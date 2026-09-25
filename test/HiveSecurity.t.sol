// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HiveArena} from "../contracts/HiveArena.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HiveSecurityTest is Test {
    HiveArena public arena;
    bytes32 public matchId = keccak256("security-match-001");
    address public operator = address(0x10);
    address public resolver = address(0x20);
    address public purplePlayer = address(0x101);
    address public chogPlayer = address(0x201);
    address public attacker = address(0x666);

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
            keccak256("roster-sec"),
            keccak256("rules-sec"),
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

    function test_RevertWhen_NonRosterCommits() public {
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId); // Deliberate
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId); // Commit

        bytes32 commitHash = arena.computeCommitmentHash(
            matchId,
            1,
            attacker,
            HiveTypes.Stage.Initial,
            HiveTypes.Choice.A,
            keccak256("salt")
        );

        vm.prank(attacker);
        vm.expectRevert(HiveTypes.NotInRoster.selector);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitHash);
    }

    function test_RevertWhen_LateCommit() public {
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId); // Deliberate
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId); // Commit

        // Warp past commit deadline (15 seconds)
        vm.warp(block.timestamp + 16);

        bytes32 commitHash = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer,
            HiveTypes.Stage.Initial,
            HiveTypes.Choice.A,
            keccak256("salt")
        );

        vm.prank(purplePlayer);
        vm.expectRevert(HiveTypes.LateSubmission.selector);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitHash);
    }

    function test_RevertWhen_RevisionOutsidePhase() public {
        // Currently in Think phase
        vm.prank(purplePlayer);
        vm.expectRevert(HiveTypes.InvalidPhase.selector);
        arena.submitRevision(matchId, 1, true, HiveTypes.AttributionKind.None, bytes32(0));
    }

    function test_RevertWhen_NonResolverResolvesOutcome() public {
        vm.prank(attacker);
        vm.expectRevert(HiveTypes.NotAuthorized.selector);
        arena.resolveRoundOutcome(matchId, 1, HiveTypes.Choice.A, false);
    }

    function test_RevertWhen_NonOperatorSetsRoster() public {
        address[] memory p = new address[](1);
        p[0] = attacker;

        vm.prank(attacker);
        vm.expectRevert(HiveTypes.NotAuthorized.selector);
        arena.setRoster(matchId, p, p, attacker, attacker);
    }

    function test_RevertWhen_SettingRosterAfterLock() public {
        // Match was already started in setUp (which locks the match)
        address[] memory p = new address[](1);
        p[0] = purplePlayer;

        vm.prank(operator);
        vm.expectRevert(HiveTypes.RosterLocked.selector);
        arena.setRoster(matchId, p, p, purplePlayer, chogPlayer);
    }

    function test_Fuzz_UnauthorizedPlayerCannotCommit(address randomUser) public {
        vm.assume(randomUser != purplePlayer && randomUser != chogPlayer);

        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId); // Deliberate
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId); // Commit

        bytes32 commitHash = arena.computeCommitmentHash(
            matchId,
            1,
            randomUser,
            HiveTypes.Stage.Initial,
            HiveTypes.Choice.A,
            keccak256("salt")
        );

        vm.prank(randomUser);
        vm.expectRevert(HiveTypes.NotInRoster.selector);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitHash);
    }
}
