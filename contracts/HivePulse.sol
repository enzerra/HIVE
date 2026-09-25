// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IHivePulse} from "./interfaces/IHivePulse.sol";
import {HiveTypes} from "./libraries/HiveTypes.sol";
import {HiveScoring} from "./libraries/HiveScoring.sol";

contract HivePulse is IHivePulse {
    mapping(bytes32 => Call) private _calls;
    mapping(bytes32 => mapping(address => Prediction)) private _predictions;

    modifier onlyResolver(bytes32 callId) {
        if (msg.sender != _calls[callId].resolver && msg.sender != _calls[callId].creator) {
            revert HiveTypes.NotAuthorized();
        }
        _;
    }

    function createCall(
        bytes32 callId,
        bytes32 questionHash,
        uint256 closesAt,
        address resolver
    ) external override {
        if (_calls[callId].callId != bytes32(0)) {
            revert HiveTypes.AlreadyCommitted();
        }
        if (closesAt <= block.timestamp) {
            revert HiveTypes.InvalidPhase();
        }

        _calls[callId] = Call({
            callId: callId,
            questionHash: questionHash,
            createdAt: block.timestamp,
            closesAt: closesAt,
            creator: msg.sender,
            resolver: resolver == address(0) ? msg.sender : resolver,
            stage: HiveTypes.OpenCallStage.Open,
            outcome: HiveTypes.Choice.None,
            totalParticipants: 0,
            aCount: 0,
            bCount: 0
        });

        emit CallCreated(callId, questionHash, msg.sender, resolver, closesAt);
    }

    function lockChoice(
        bytes32 callId,
        bytes32 commitmentHash,
        bytes32 reasonHash
    ) external override {
        Call storage c = _calls[callId];
        if (c.stage != HiveTypes.OpenCallStage.Open) {
            revert HiveTypes.CallPhaseClosed();
        }
        if (block.timestamp >= c.closesAt) {
            c.stage = HiveTypes.OpenCallStage.Discussing;
            revert HiveTypes.CallPhaseClosed();
        }

        Prediction storage p = _predictions[callId][msg.sender];
        if (p.initialLocked) {
            revert HiveTypes.CallAlreadyLocked();
        }

        p.commitmentHash = commitmentHash;
        p.reasonHash = reasonHash;
        p.initialLocked = true;
        c.totalParticipants++;

        emit CallLocked(callId, msg.sender, commitmentHash, reasonHash);
    }

    function revealChoice(
        bytes32 callId,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external override {
        if (choice != HiveTypes.Choice.A && choice != HiveTypes.Choice.B) {
            revert HiveTypes.InvalidChoice();
        }

        Call storage c = _calls[callId];
        Prediction storage p = _predictions[callId][msg.sender];

        if (!p.initialLocked) {
            revert HiveTypes.InitialRequired();
        }
        if (p.revealed) {
            revert HiveTypes.AlreadyRevealed();
        }

        bytes32 expected = computePulseCommitment(callId, msg.sender, choice, salt);
        if (p.commitmentHash != expected) {
            revert HiveTypes.InvalidReveal();
        }

        p.initialChoice = choice;
        p.finalChoice = choice; // Defaults to initial choice (Stay)
        p.revealed = true;

        if (choice == HiveTypes.Choice.A) {
            c.aCount++;
        } else {
            c.bCount++;
        }

        emit CallRevealed(callId, msg.sender, choice);
    }

    function reviseChoice(
        bytes32 callId,
        HiveTypes.Choice finalChoice
    ) external override {
        if (finalChoice != HiveTypes.Choice.A && finalChoice != HiveTypes.Choice.B) {
            revert HiveTypes.InvalidChoice();
        }

        Call storage c = _calls[callId];
        if (c.stage != HiveTypes.OpenCallStage.Discussing && c.stage != HiveTypes.OpenCallStage.Open) {
            revert HiveTypes.CallPhaseClosed();
        }

        Prediction storage p = _predictions[callId][msg.sender];
        if (!p.initialLocked || !p.revealed) {
            revert HiveTypes.InitialRequired();
        }

        p.finalChoice = finalChoice;
        p.finalLocked = true;

        emit CallRevised(callId, msg.sender, finalChoice);
    }

    function advanceToResolving(bytes32 callId) external onlyResolver(callId) {
        Call storage c = _calls[callId];
        if (c.stage != HiveTypes.OpenCallStage.Open && c.stage != HiveTypes.OpenCallStage.Discussing) {
            revert HiveTypes.CallPhaseClosed();
        }
        c.stage = HiveTypes.OpenCallStage.Resolving;
    }

    function resolveCall(
        bytes32 callId,
        HiveTypes.Choice outcome
    ) external override onlyResolver(callId) {
        if (outcome != HiveTypes.Choice.A && outcome != HiveTypes.Choice.B) {
            revert HiveTypes.InvalidChoice();
        }

        Call storage c = _calls[callId];
        c.outcome = outcome;
        c.stage = HiveTypes.OpenCallStage.Resolved;

        emit CallResolved(callId, outcome);
    }

    function voidCall(
        bytes32 callId,
        string calldata reason
    ) external override onlyResolver(callId) {
        Call storage c = _calls[callId];
        c.stage = HiveTypes.OpenCallStage.Void;
        emit CallVoided(callId, reason);
    }

    function getCall(
        bytes32 callId
    ) external view override returns (Call memory) {
        return _calls[callId];
    }

    function getPrediction(
        bytes32 callId,
        address user
    ) external view override returns (Prediction memory) {
        return _predictions[callId][user];
    }

    function computePulseCommitment(
        bytes32 callId,
        address user,
        HiveTypes.Choice choice,
        bytes32 salt
    ) public pure override returns (bytes32) {
        return keccak256(abi.encode(callId, user, choice, salt));
    }
}
