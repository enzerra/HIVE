// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

library HiveTypes {
    enum Choice {
        None,
        A,
        B
    }

    enum Phase {
        Think,
        Deliberate,
        Commit,
        Reveal,
        Council,
        Revision,
        Resolve
    }

    enum Stage {
        Initial,
        Final
    }

    enum MatchLifecycle {
        Draft,
        Lobby,
        Locked,
        Running,
        AwaitingOutcomes,
        Settled,
        Void,
        NoContest
    }

    enum AttributionKind {
        None,
        OtherSquadArgument,
        InternalDiscussion,
        NewEvidence,
        OwnReconsideration,
        Undisclosed
    }

    enum HiveId {
        Purple,
        Chog
    }

    enum SettlementOutcome {
        Pending,
        Win,
        Draw,
        NoContest
    }

    enum OpenCallStage {
        Open,
        Discussing,
        Resolving,
        Resolved,
        Void
    }

    struct RoundDurations {
        uint16 think; // default: 20
        uint16 deliberate; // default: 60
        uint16 commit; // default: 15
        uint16 reveal; // default: 10
        uint16 council; // default: 60
        uint16 revision; // default: 20
        uint16 resolve; // default: 5
    }

    struct PlayerCommitment {
        bytes32 initialCommitment;
        bytes32 finalCommitment;
        Choice initialChoice;
        Choice finalChoice;
        bool initialRevealed;
        bool finalRevealed;
        bool isStay;
        AttributionKind attribution;
        bytes32 attributionCardId;
    }

    struct RoundBelief {
        uint256 initialBeliefMicros;
        uint256 finalBeliefMicros;
        uint256 scoreMicros;
        int256 wisdomLiftMicroPp;
        int256 scoreLiftMicros;
        bool forfeit;
        bool calculated;
    }

    struct RoundState {
        Phase phase;
        uint256 phaseStartedAt;
        uint256 phaseDeadline;
        bytes32 argumentHashPurple;
        bytes32 argumentHashChog;
        Choice outcome;
        bool resolved;
        bool isVoid;
        RoundBelief purple;
        RoundBelief chog;
    }

    struct MatchSettlement {
        SettlementOutcome outcome;
        uint8 winnerHive; // 0: Purple, 1: Chog, 2: Draw/None
        uint256 purpleTotalScore;
        uint256 chogTotalScore;
        uint8 validRounds;
    }

    // Custom errors
    error NotAuthorized();
    error NotInRoster();
    error InvalidPhase();
    error PhaseClosed();
    error AlreadyCommitted();
    error InitialRequired();
    error AlreadyRevealed();
    error InvalidReveal();
    error LateSubmission();
    error InvalidChoice();
    error InvalidRound();
    error MatchNotRunning();
    error RosterLocked();
    error MatchAlreadySettled();
    error RoundAlreadyResolved();
    error RoundNotResolved();
    error InvalidDurations();
    error CallAlreadyLocked();
    error CallPhaseClosed();
}
