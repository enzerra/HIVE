// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {HiveTypes} from "../libraries/HiveTypes.sol";

interface IHiveArena {
    // Events
    event MatchCreated(
        bytes32 indexed matchId,
        address indexed creator,
        address indexed operator,
        address resolver,
        bytes32 rosterHash,
        bytes32 rulesHash
    );

    event RosterSet(
        bytes32 indexed matchId,
        uint256 purpleCount,
        uint256 chogCount,
        address purpleRep,
        address chogRep
    );

    event MatchLocked(bytes32 indexed matchId, uint256 timestamp);

    event MatchStarted(bytes32 indexed matchId, uint256 timestamp);

    event PhaseAdvanced(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        HiveTypes.Phase newPhase,
        uint256 deadline
    );

    event CommitmentSubmitted(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        address indexed player,
        HiveTypes.Stage stage,
        bytes32 commitmentHash
    );

    event ChoiceRevealed(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        address indexed player,
        HiveTypes.Stage stage,
        HiveTypes.Choice choice
    );

    event RevisionSubmitted(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        address indexed player,
        bool isStay,
        HiveTypes.AttributionKind attribution,
        bytes32 cardId
    );

    event ArgumentCommitted(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        HiveTypes.HiveId indexed hiveId,
        bytes32 argumentHash
    );

    event RoundResolved(
        bytes32 indexed matchId,
        uint8 indexed roundId,
        HiveTypes.Choice outcome,
        bool isVoid,
        uint256 purpleScore,
        uint256 chogScore,
        int256 purpleWisdomLift,
        int256 chogWisdomLift
    );

    event MatchSettled(
        bytes32 indexed matchId,
        HiveTypes.SettlementOutcome outcome,
        uint8 winnerHive,
        uint256 purpleTotalScore,
        uint256 chogTotalScore,
        uint8 validRounds
    );

    event MatchVoided(bytes32 indexed matchId, string reason);

    // External functions
    function createMatch(
        bytes32 matchId,
        bytes32 rosterHash,
        bytes32 rulesHash,
        address operator,
        address resolver,
        HiveTypes.RoundDurations calldata durations
    ) external;

    function setRoster(
        bytes32 matchId,
        address[] calldata purplePlayers,
        address[] calldata chogPlayers,
        address purpleRep,
        address chogRep
    ) external;

    function lockMatch(bytes32 matchId) external;

    function startMatch(bytes32 matchId) external;

    function advancePhase(bytes32 matchId) external;

    function commitChoice(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Stage stage,
        bytes32 commitmentHash
    ) external;

    function commitArgument(
        bytes32 matchId,
        uint8 roundId,
        bytes32 argumentHash
    ) external;

    function revealChoice(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Stage stage,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external;

    function submitRevision(
        bytes32 matchId,
        uint8 roundId,
        bool isStay,
        HiveTypes.AttributionKind attribution,
        bytes32 cardId
    ) external;

    function resolveRoundOutcome(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Choice outcome,
        bool isVoid
    ) external;

    function settleMatch(bytes32 matchId) external;

    function voidMatch(bytes32 matchId, string calldata reason) external;

    // View functions
    function getMatchLifecycle(bytes32 matchId) external view returns (HiveTypes.MatchLifecycle);

    function getRound(
        bytes32 matchId,
        uint8 roundId
    ) external view returns (HiveTypes.RoundState memory);

    function getPlayerCommitment(
        bytes32 matchId,
        uint8 roundId,
        address player
    ) external view returns (HiveTypes.PlayerCommitment memory);

    function getMatchSettlement(
        bytes32 matchId
    ) external view returns (HiveTypes.MatchSettlement memory);

    function isPlayerInRoster(
        bytes32 matchId,
        address player
    ) external view returns (bool inRoster, HiveTypes.HiveId hiveId);

    function computeCommitmentHash(
        bytes32 matchId,
        uint8 roundId,
        address player,
        HiveTypes.Stage stage,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external pure returns (bytes32);
}
