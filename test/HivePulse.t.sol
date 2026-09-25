// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HivePulse} from "../contracts/HivePulse.sol";
import {IHivePulse} from "../contracts/interfaces/IHivePulse.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HivePulseTest is Test {
    HivePulse public pulse;
    bytes32 public callId = keccak256("steam-pulse-001");
    bytes32 public questionHash = keccak256("CS2 vs Dota2 relative concurrent growth");
    address public resolver = address(0x20);
    address public user1 = address(0x101);
    address public user2 = address(0x102);
    uint256 public closesAt;

    function setUp() public {
        pulse = new HivePulse();
        closesAt = block.timestamp + 3600; // 1 hour

        pulse.createCall(callId, questionHash, closesAt, resolver);
    }

    function test_QuickPulse_HappyPath() public {
        bytes32 salt1 = keccak256("salt_user1");
        bytes32 reason1 = keccak256("CS2 has higher weekend surge");
        bytes32 commit1 = pulse.computePulseCommitment(callId, user1, HiveTypes.Choice.A, salt1);

        // Lock choice before crowd disclosure
        vm.prank(user1);
        pulse.lockChoice(callId, commit1, reason1);

        IHivePulse.Prediction memory p = pulse.getPrediction(callId, user1);
        assertTrue(p.initialLocked);
        assertFalse(p.revealed);

        // Reveal choice
        vm.prank(user1);
        pulse.revealChoice(callId, HiveTypes.Choice.A, salt1);

        p = pulse.getPrediction(callId, user1);
        assertTrue(p.revealed);
        assertEq(uint8(p.initialChoice), uint8(HiveTypes.Choice.A));
        assertEq(uint8(p.finalChoice), uint8(HiveTypes.Choice.A));

        // Revise choice (Switch to B)
        vm.prank(user1);
        pulse.reviseChoice(callId, HiveTypes.Choice.B);

        p = pulse.getPrediction(callId, user1);
        assertTrue(p.finalLocked);
        assertEq(uint8(p.finalChoice), uint8(HiveTypes.Choice.B));

        // Advance to resolving and resolve
        vm.prank(resolver);
        pulse.advanceToResolving(callId);

        vm.prank(resolver);
        pulse.resolveCall(callId, HiveTypes.Choice.B);

        IHivePulse.Call memory c = pulse.getCall(callId);
        assertEq(uint8(c.stage), uint8(HiveTypes.OpenCallStage.Resolved));
        assertEq(uint8(c.outcome), uint8(HiveTypes.Choice.B));
    }

    function test_QuickPulse_Void() public {
        vm.prank(resolver);
        pulse.voidCall(callId, "Tie in Steam concurrent player growth");

        IHivePulse.Call memory c = pulse.getCall(callId);
        assertEq(uint8(c.stage), uint8(HiveTypes.OpenCallStage.Void));
    }

    function test_RevertWhen_LockingAfterClosingTime() public {
        vm.warp(closesAt + 1);

        bytes32 salt = keccak256("salt");
        bytes32 commit = pulse.computePulseCommitment(callId, user1, HiveTypes.Choice.A, salt);

        vm.prank(user1);
        vm.expectRevert(HiveTypes.CallPhaseClosed.selector);
        pulse.lockChoice(callId, commit, keccak256("reason"));
    }

    function test_RevertWhen_LockingTwice() public {
        bytes32 salt = keccak256("salt");
        bytes32 commit = pulse.computePulseCommitment(callId, user1, HiveTypes.Choice.A, salt);

        vm.prank(user1);
        pulse.lockChoice(callId, commit, keccak256("reason"));

        vm.prank(user1);
        vm.expectRevert(HiveTypes.CallAlreadyLocked.selector);
        pulse.lockChoice(callId, commit, keccak256("reason"));
    }

    function test_RevertWhen_InvalidPulseReveal() public {
        bytes32 salt = keccak256("salt");
        bytes32 commit = pulse.computePulseCommitment(callId, user1, HiveTypes.Choice.A, salt);

        vm.prank(user1);
        pulse.lockChoice(callId, commit, keccak256("reason"));

        vm.prank(user1);
        vm.expectRevert(HiveTypes.InvalidReveal.selector);
        pulse.revealChoice(callId, HiveTypes.Choice.B, salt); // Reveal Choice.B when committed Choice.A
    }
}
