// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {HiveTypes} from "../libraries/HiveTypes.sol";

interface IHivePulse {
    struct Call {
        bytes32 callId;
        bytes32 questionHash;
        uint256 createdAt;
        uint256 closesAt;
        address creator;
        address resolver;
        HiveTypes.OpenCallStage stage;
        HiveTypes.Choice outcome;
        uint256 totalParticipants;
        uint256 aCount;
        uint256 bCount;
    }

    struct Prediction {
        bytes32 commitmentHash;
        bytes32 reasonHash;
        HiveTypes.Choice initialChoice;
        HiveTypes.Choice finalChoice;
        bool initialLocked;
        bool finalLocked;
        bool revealed;
    }

    event CallCreated(
        bytes32 indexed callId,
        bytes32 indexed questionHash,
        address indexed creator,
        address resolver,
        uint256 closesAt
    );

    event CallLocked(
        bytes32 indexed callId,
        address indexed user,
        bytes32 commitmentHash,
        bytes32 reasonHash
    );

    event CallRevealed(
        bytes32 indexed callId,
        address indexed user,
        HiveTypes.Choice choice
    );

    event CallRevised(
        bytes32 indexed callId,
        address indexed user,
        HiveTypes.Choice finalChoice
    );

    event CallResolved(
        bytes32 indexed callId,
        HiveTypes.Choice outcome
    );

    event CallVoided(
        bytes32 indexed callId,
        string reason
    );

    function createCall(
        bytes32 callId,
        bytes32 questionHash,
        uint256 closesAt,
        address resolver
    ) external;

    function lockChoice(
        bytes32 callId,
        bytes32 commitmentHash,
        bytes32 reasonHash
    ) external;

    function revealChoice(
        bytes32 callId,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external;

    function reviseChoice(
        bytes32 callId,
        HiveTypes.Choice finalChoice
    ) external;

    function resolveCall(
        bytes32 callId,
        HiveTypes.Choice outcome
    ) external;

    function voidCall(
        bytes32 callId,
        string calldata reason
    ) external;

    function getCall(
        bytes32 callId
    ) external view returns (Call memory);

    function getPrediction(
        bytes32 callId,
        address user
    ) external view returns (Prediction memory);

    function computePulseCommitment(
        bytes32 callId,
        address user,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external pure returns (bytes32);
}
