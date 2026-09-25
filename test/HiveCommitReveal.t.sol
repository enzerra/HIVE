// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HiveArena} from "../contracts/HiveArena.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HiveCommitRevealTest is Test {
    HiveArena public arena;
    bytes32 public matchId = keccak256("match-001");
    address public operator = address(0x10);
    address public resolver = address(0x20);
    address public purplePlayer1 = address(0x101);
    address public purplePlayer2 = address(0x102);
    address public chogPlayer1 = address(0x201);
    address public chogPlayer2 = address(0x202);

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
            keccak256("roster-v1"),
            keccak256("rules-v1"),
            operator,
            resolver,
            durations
        );

        address[] memory pPlayers = new address[](2);
        pPlayers[0] = purplePlayer1;
        pPlayers[1] = purplePlayer2;

        address[] memory cPlayers = new address[](2);
        cPlayers[0] = chogPlayer1;
        cPlayers[1] = chogPlayer2;

        vm.prank(operator);
        arena.setRoster(matchId, pPlayers, cPlayers, purplePlayer1, chogPlayer1);

        vm.prank(operator);
        arena.startMatch(matchId);

        // Advance from Think -> Deliberate -> Commit
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId); // to Deliberate
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId); // to Commit
    }

    function test_CommitAndReveal_Success() public {
        bytes32 salt = keccak256("secret_salt_123");
        HiveTypes.Choice choice = HiveTypes.Choice.A;

        bytes32 commitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            choice,
            salt
        );

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        // Advance to Reveal phase
        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        // Reveal choice
        vm.prank(purplePlayer1);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, salt);

        HiveTypes.PlayerCommitment memory pc = arena.getPlayerCommitment(matchId, 1, purplePlayer1);
        assertTrue(pc.initialRevealed);
        assertEq(uint8(pc.initialChoice), uint8(HiveTypes.Choice.A));
    }

    function test_RevertWhen_InvalidSalt() public {
        bytes32 realSalt = keccak256("real_salt");
        bytes32 fakeSalt = keccak256("fake_salt");
        HiveTypes.Choice choice = HiveTypes.Choice.A;

        bytes32 commitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            choice,
            realSalt
        );

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        vm.prank(purplePlayer1);
        vm.expectRevert(HiveTypes.InvalidReveal.selector);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, fakeSalt);
    }

    function test_RevertWhen_WrongChoiceRevealed() public {
        bytes32 salt = keccak256("salt_1");
        bytes32 commitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            HiveTypes.Choice.A,
            salt
        );

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        vm.prank(purplePlayer1);
        vm.expectRevert(HiveTypes.InvalidReveal.selector);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, HiveTypes.Choice.B, salt);
    }

    function test_RevertWhen_DuplicateReveal() public {
        bytes32 salt = keccak256("salt_dup");
        HiveTypes.Choice choice = HiveTypes.Choice.A;

        bytes32 commitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            choice,
            salt
        );

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        vm.prank(purplePlayer1);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, salt);

        // Second reveal must revert
        vm.prank(purplePlayer1);
        vm.expectRevert(HiveTypes.AlreadyRevealed.selector);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, salt);
    }

    function test_RevertWhen_DuplicateCommit() public {
        bytes32 commitment = keccak256("commit_1");

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        vm.prank(purplePlayer1);
        vm.expectRevert(HiveTypes.AlreadyCommitted.selector);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);
    }

    function test_RevertWhen_FrontRunningAnotherPlayerCommitment() public {
        bytes32 salt = keccak256("salt_victim");
        HiveTypes.Choice choice = HiveTypes.Choice.B;

        // Victim computes commitment with their address
        bytes32 victimCommitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            choice,
            salt
        );

        // Attacker attempts to submit the same commitment for themselves
        vm.prank(purplePlayer2);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, victimCommitment);

        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        // Attacker attempts to reveal with victim's salt and choice
        // Must revert because computeCommitmentHash binds msg.sender!
        vm.prank(purplePlayer2);
        vm.expectRevert(HiveTypes.InvalidReveal.selector);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, salt);
    }

    function test_Fuzz_CommitReveal(bytes32 salt, uint8 choiceRaw) public {
        vm.assume(choiceRaw == 1 || choiceRaw == 2);
        HiveTypes.Choice choice = choiceRaw == 1 ? HiveTypes.Choice.A : HiveTypes.Choice.B;

        bytes32 commitment = arena.computeCommitmentHash(
            matchId,
            1,
            purplePlayer1,
            HiveTypes.Stage.Initial,
            choice,
            salt
        );

        vm.prank(purplePlayer1);
        arena.commitChoice(matchId, 1, HiveTypes.Stage.Initial, commitment);

        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        vm.prank(purplePlayer1);
        arena.revealChoice(matchId, 1, HiveTypes.Stage.Initial, choice, salt);

        HiveTypes.PlayerCommitment memory pc = arena.getPlayerCommitment(matchId, 1, purplePlayer1);
        assertTrue(pc.initialRevealed);
        assertEq(uint8(pc.initialChoice), uint8(choice));
    }
}
