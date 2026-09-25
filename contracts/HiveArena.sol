// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {IHiveArena} from "./interfaces/IHiveArena.sol";
import {HiveTypes} from "./libraries/HiveTypes.sol";
import {HiveScoring} from "./libraries/HiveScoring.sol";

contract HiveArena is IHiveArena {
    struct Match {
        bytes32 matchId;
        address creator;
        address operator;
        address resolver;
        bytes32 rosterHash;
        bytes32 rulesHash;
        HiveTypes.MatchLifecycle lifecycle;
        uint8 currentRound; // 1, 2, 3
        HiveTypes.RoundDurations durations;
        uint256 createdAt;
        uint256 startedAt;
        uint8 purpleSquadCount;
        uint8 chogSquadCount;
    }

    // Storage
    mapping(bytes32 => Match) private _matches;
    mapping(bytes32 => mapping(uint8 => HiveTypes.RoundState)) private _rounds;
    mapping(bytes32 => mapping(uint8 => mapping(address => HiveTypes.PlayerCommitment))) private _commitments;
    mapping(bytes32 => HiveTypes.MatchSettlement) private _settlements;

    // Roster tracking
    mapping(bytes32 => address[]) private _purplePlayers;
    mapping(bytes32 => address[]) private _chogPlayers;
    mapping(bytes32 => mapping(address => bool)) private _isPurple;
    mapping(bytes32 => mapping(address => bool)) private _isChog;
    mapping(bytes32 => mapping(address => uint8)) private _playerSquad;
    mapping(bytes32 => mapping(uint8 => uint256)) private _purpleSquadSize;
    mapping(bytes32 => mapping(uint8 => uint256)) private _chogSquadSize;
    mapping(bytes32 => address) private _purpleRep;
    mapping(bytes32 => address) private _chogRep;

    modifier onlyOperator(bytes32 matchId) {
        if (msg.sender != _matches[matchId].operator && msg.sender != _matches[matchId].creator) {
            revert HiveTypes.NotAuthorized();
        }
        _;
    }

    modifier onlyResolver(bytes32 matchId) {
        if (msg.sender != _matches[matchId].resolver && msg.sender != _matches[matchId].operator) {
            revert HiveTypes.NotAuthorized();
        }
        _;
    }

    // -------------------------------------------------------------
    // Match Setup & Administration
    // -------------------------------------------------------------

    function createMatch(
        bytes32 matchId,
        bytes32 rosterHash,
        bytes32 rulesHash,
        address operator,
        address resolver,
        HiveTypes.RoundDurations calldata durations
    ) external override {
        if (_matches[matchId].matchId != bytes32(0)) {
            revert HiveTypes.AlreadyCommitted();
        }

        if (
            durations.think == 0 ||
            durations.deliberate == 0 ||
            durations.commit == 0 ||
            durations.reveal == 0 ||
            durations.council == 0 ||
            durations.revision == 0 ||
            durations.resolve == 0
        ) {
            revert HiveTypes.InvalidDurations();
        }

        _matches[matchId] = Match({
            matchId: matchId,
            creator: msg.sender,
            operator: operator == address(0) ? msg.sender : operator,
            resolver: resolver == address(0) ? msg.sender : resolver,
            rosterHash: rosterHash,
            rulesHash: rulesHash,
            lifecycle: HiveTypes.MatchLifecycle.Lobby,
            currentRound: 1,
            durations: durations,
            createdAt: block.timestamp,
            startedAt: 0,
            purpleSquadCount: 0,
            chogSquadCount: 0
        });

        emit MatchCreated(
            matchId,
            msg.sender,
            _matches[matchId].operator,
            _matches[matchId].resolver,
            rosterHash,
            rulesHash
        );
    }

    function setRoster(
        bytes32 matchId,
        address[] calldata purplePlayers,
        address[] calldata chogPlayers,
        address purpleRep,
        address chogRep
    ) external override onlyOperator(matchId) {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Lobby) {
            revert HiveTypes.RosterLocked();
        }

        uint256 pLen = purplePlayers.length;
        uint256 cLen = chogPlayers.length;
        if (pLen == 0 || cLen == 0) {
            revert HiveTypes.NotInRoster();
        }

        _clearRoster(matchId);

        _purpleRep[matchId] = purpleRep;
        _chogRep[matchId] = chogRep;

        uint8 pSquads = uint8((pLen + 3) / 4);
        uint8 cSquads = uint8((cLen + 3) / 4);
        m.purpleSquadCount = pSquads;
        m.chogSquadCount = cSquads;

        for (uint256 i = 0; i < pLen; i++) {
            address p = purplePlayers[i];
            _purplePlayers[matchId].push(p);
            _isPurple[matchId][p] = true;
            uint8 sIdx = uint8(i / 4);
            _playerSquad[matchId][p] = sIdx;
            _purpleSquadSize[matchId][sIdx]++;
        }

        for (uint256 i = 0; i < cLen; i++) {
            address c = chogPlayers[i];
            _chogPlayers[matchId].push(c);
            _isChog[matchId][c] = true;
            uint8 sIdx = uint8(i / 4);
            _playerSquad[matchId][c] = sIdx;
            _chogSquadSize[matchId][sIdx]++;
        }

        emit RosterSet(matchId, pLen, cLen, purpleRep, chogRep);
    }

    function _clearRoster(bytes32 matchId) internal {
        Match storage m = _matches[matchId];
        for (uint8 s = 0; s < m.purpleSquadCount; s++) {
            _purpleSquadSize[matchId][s] = 0;
        }
        for (uint8 s = 0; s < m.chogSquadCount; s++) {
            _chogSquadSize[matchId][s] = 0;
        }

        uint256 pLen = _purplePlayers[matchId].length;
        for (uint256 i = 0; i < pLen; i++) {
            address p = _purplePlayers[matchId][i];
            _isPurple[matchId][p] = false;
        }
        delete _purplePlayers[matchId];

        uint256 cLen = _chogPlayers[matchId].length;
        for (uint256 i = 0; i < cLen; i++) {
            address c = _chogPlayers[matchId][i];
            _isChog[matchId][c] = false;
        }
        delete _chogPlayers[matchId];
    }

    function lockMatch(bytes32 matchId) external override onlyOperator(matchId) {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Lobby) {
            revert HiveTypes.InvalidPhase();
        }
        m.lifecycle = HiveTypes.MatchLifecycle.Locked;
        emit MatchLocked(matchId, block.timestamp);
    }

    function startMatch(bytes32 matchId) external override onlyOperator(matchId) {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Locked && m.lifecycle != HiveTypes.MatchLifecycle.Lobby) {
            revert HiveTypes.InvalidPhase();
        }

        m.lifecycle = HiveTypes.MatchLifecycle.Running;
        m.startedAt = block.timestamp;
        m.currentRound = 1;

        HiveTypes.RoundState storage r = _rounds[matchId][1];
        r.phase = HiveTypes.Phase.Think;
        r.phaseStartedAt = block.timestamp;
        r.phaseDeadline = block.timestamp + m.durations.think;

        emit MatchStarted(matchId, block.timestamp);
        emit PhaseAdvanced(matchId, 1, HiveTypes.Phase.Think, r.phaseDeadline);
    }

    // -------------------------------------------------------------
    // Phase Transitions
    // -------------------------------------------------------------

    function advancePhase(bytes32 matchId) external override {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Running) {
            revert HiveTypes.MatchNotRunning();
        }

        uint8 roundId = m.currentRound;
        HiveTypes.RoundState storage r = _rounds[matchId][roundId];

        bool isOp = (msg.sender == m.operator || msg.sender == m.creator);
        if (!isOp && block.timestamp < r.phaseDeadline) {
            revert HiveTypes.PhaseClosed();
        }

        if (r.phase == HiveTypes.Phase.Think) {
            r.phase = HiveTypes.Phase.Deliberate;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.deliberate;
        } else if (r.phase == HiveTypes.Phase.Deliberate) {
            r.phase = HiveTypes.Phase.Commit;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.commit;
        } else if (r.phase == HiveTypes.Phase.Commit) {
            r.phase = HiveTypes.Phase.Reveal;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.reveal;
        } else if (r.phase == HiveTypes.Phase.Reveal) {
            _tallyInitialBeliefs(matchId, roundId);

            r.phase = HiveTypes.Phase.Council;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.council;
        } else if (r.phase == HiveTypes.Phase.Council) {
            r.phase = HiveTypes.Phase.Revision;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.revision;
        } else if (r.phase == HiveTypes.Phase.Revision) {
            r.phase = HiveTypes.Phase.Resolve;
            r.phaseStartedAt = block.timestamp;
            r.phaseDeadline = block.timestamp + m.durations.resolve;
        } else if (r.phase == HiveTypes.Phase.Resolve) {
            _tallyFinalBeliefs(matchId, roundId);

            if (roundId < 3) {
                m.currentRound = roundId + 1;
                HiveTypes.RoundState storage nextR = _rounds[matchId][m.currentRound];
                nextR.phase = HiveTypes.Phase.Think;
                nextR.phaseStartedAt = block.timestamp;
                nextR.phaseDeadline = block.timestamp + m.durations.think;

                emit PhaseAdvanced(matchId, m.currentRound, HiveTypes.Phase.Think, nextR.phaseDeadline);
                return;
            } else {
                m.lifecycle = HiveTypes.MatchLifecycle.AwaitingOutcomes;
                return;
            }
        }

        emit PhaseAdvanced(matchId, roundId, r.phase, r.phaseDeadline);
    }

    // -------------------------------------------------------------
    // Player Commit & Reveal
    // -------------------------------------------------------------

    function commitChoice(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Stage stage,
        bytes32 commitmentHash
    ) external override {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Running || m.currentRound != roundId) {
            revert HiveTypes.MatchNotRunning();
        }

        if (!_isPurple[matchId][msg.sender] && !_isChog[matchId][msg.sender]) {
            revert HiveTypes.NotInRoster();
        }

        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        if (block.timestamp > r.phaseDeadline) {
            revert HiveTypes.LateSubmission();
        }

        HiveTypes.PlayerCommitment storage pc = _commitments[matchId][roundId][msg.sender];

        if (stage == HiveTypes.Stage.Initial) {
            if (r.phase != HiveTypes.Phase.Commit) revert HiveTypes.InvalidPhase();
            if (pc.initialCommitment != bytes32(0)) revert HiveTypes.AlreadyCommitted();
            pc.initialCommitment = commitmentHash;
        } else {
            if (r.phase != HiveTypes.Phase.Revision) revert HiveTypes.InvalidPhase();
            if (!pc.initialRevealed) revert HiveTypes.InitialRequired();
            if (pc.finalCommitment != bytes32(0)) revert HiveTypes.AlreadyCommitted();
            pc.finalCommitment = commitmentHash;
        }

        emit CommitmentSubmitted(matchId, roundId, msg.sender, stage, commitmentHash);
    }

    function commitArgument(
        bytes32 matchId,
        uint8 roundId,
        bytes32 argumentHash
    ) external override {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Running || m.currentRound != roundId) {
            revert HiveTypes.MatchNotRunning();
        }

        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        if (r.phase != HiveTypes.Phase.Deliberate && r.phase != HiveTypes.Phase.Commit) {
            revert HiveTypes.InvalidPhase();
        }
        if (block.timestamp > r.phaseDeadline) {
            revert HiveTypes.LateSubmission();
        }

        HiveTypes.HiveId hId;
        if (msg.sender == _purpleRep[matchId]) {
            hId = HiveTypes.HiveId.Purple;
            r.argumentHashPurple = argumentHash;
        } else if (msg.sender == _chogRep[matchId]) {
            hId = HiveTypes.HiveId.Chog;
            r.argumentHashChog = argumentHash;
        } else {
            revert HiveTypes.NotAuthorized();
        }

        emit ArgumentCommitted(matchId, roundId, hId, argumentHash);
    }

    function revealChoice(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Stage stage,
        HiveTypes.Choice choice,
        bytes32 salt
    ) external override {
        if (choice != HiveTypes.Choice.A && choice != HiveTypes.Choice.B) {
            revert HiveTypes.InvalidChoice();
        }

        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Running || m.currentRound != roundId) {
            revert HiveTypes.MatchNotRunning();
        }

        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        if (block.timestamp > r.phaseDeadline) {
            revert HiveTypes.LateSubmission();
        }

        HiveTypes.PlayerCommitment storage pc = _commitments[matchId][roundId][msg.sender];

        bytes32 expected = computeCommitmentHash(matchId, roundId, msg.sender, stage, choice, salt);

        if (stage == HiveTypes.Stage.Initial) {
            if (r.phase != HiveTypes.Phase.Reveal) revert HiveTypes.InvalidPhase();
            if (pc.initialRevealed) revert HiveTypes.AlreadyRevealed();
            if (pc.initialCommitment != expected) revert HiveTypes.InvalidReveal();

            pc.initialChoice = choice;
            pc.initialRevealed = true;
            pc.isStay = true; // Default Stay
            pc.finalChoice = choice; // Default to initial choice
        } else {
            if (r.phase != HiveTypes.Phase.Resolve) revert HiveTypes.InvalidPhase();
            if (pc.finalRevealed) revert HiveTypes.AlreadyRevealed();
            if (pc.finalCommitment != expected) revert HiveTypes.InvalidReveal();

            pc.finalChoice = choice;
            pc.finalRevealed = true;
            pc.isStay = (choice == pc.initialChoice);
        }

        emit ChoiceRevealed(matchId, roundId, msg.sender, stage, choice);
    }

    function submitRevision(
        bytes32 matchId,
        uint8 roundId,
        bool isStay,
        HiveTypes.AttributionKind attribution,
        bytes32 cardId
    ) external override {
        Match storage m = _matches[matchId];
        if (m.lifecycle != HiveTypes.MatchLifecycle.Running || m.currentRound != roundId) {
            revert HiveTypes.MatchNotRunning();
        }

        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        if (r.phase != HiveTypes.Phase.Revision) {
            revert HiveTypes.InvalidPhase();
        }
        if (block.timestamp > r.phaseDeadline) {
            revert HiveTypes.LateSubmission();
        }

        HiveTypes.PlayerCommitment storage pc = _commitments[matchId][roundId][msg.sender];
        if (!pc.initialRevealed) {
            revert HiveTypes.InitialRequired();
        }
        if (pc.finalRevealed) {
            revert HiveTypes.AlreadyCommitted();
        }

        pc.isStay = isStay;
        pc.attribution = attribution;
        pc.attributionCardId = cardId;
        pc.finalRevealed = true;

        if (isStay) {
            pc.finalChoice = pc.initialChoice;
        } else {
            pc.finalChoice = (pc.initialChoice == HiveTypes.Choice.A) ? HiveTypes.Choice.B : HiveTypes.Choice.A;
        }

        emit RevisionSubmitted(matchId, roundId, msg.sender, isStay, attribution, cardId);
    }

    // -------------------------------------------------------------
    // Belief Aggregation & Anti-Forfeit Logic
    // -------------------------------------------------------------

    function _tallyInitialBeliefs(bytes32 matchId, uint8 roundId) internal {
        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        Match storage m = _matches[matchId];

        (uint256 pBelief, bool pForfeit) = _tallyHiveInitial(
            matchId,
            roundId,
            _purplePlayers[matchId],
            m.purpleSquadCount,
            true
        );
        r.purple.initialBeliefMicros = pBelief;
        r.purple.forfeit = pForfeit;

        (uint256 cBelief, bool cForfeit) = _tallyHiveInitial(
            matchId,
            roundId,
            _chogPlayers[matchId],
            m.chogSquadCount,
            false
        );
        r.chog.initialBeliefMicros = cBelief;
        r.chog.forfeit = cForfeit;
    }

    function _tallyHiveInitial(
        bytes32 matchId,
        uint8 roundId,
        address[] storage players,
        uint8 squadCount,
        bool isPurpleHive
    ) internal view returns (uint256 hiveBelief, bool forfeit) {
        uint256 pLen = players.length;
        if (pLen == 0) return (0, true);

        uint256[] memory aCounts = new uint256[](squadCount);
        uint256[] memory squadSizes = new uint256[](squadCount);

        for (uint8 s = 0; s < squadCount; s++) {
            uint256 size = isPurpleHive ? _purpleSquadSize[matchId][s] : _chogSquadSize[matchId][s];
            squadSizes[s] = size > 0 ? size : 1;
        }

        for (uint256 i = 0; i < pLen; i++) {
            address p = players[i];
            HiveTypes.PlayerCommitment storage pc = _commitments[matchId][roundId][p];
            if (!pc.initialRevealed) {
                return (0, true);
            }
            uint8 sIdx = _playerSquad[matchId][p];
            if (pc.initialChoice == HiveTypes.Choice.A) {
                aCounts[sIdx]++;
            }
        }

        hiveBelief = HiveScoring.meanBelief(aCounts, squadSizes);
        forfeit = false;
    }

    function _tallyFinalBeliefs(bytes32 matchId, uint8 roundId) internal {
        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        Match storage m = _matches[matchId];

        (uint256 pFinal, bool pForfeit) = _tallyHiveFinal(
            matchId,
            roundId,
            _purplePlayers[matchId],
            m.purpleSquadCount,
            r.purple.forfeit,
            true
        );
        r.purple.finalBeliefMicros = pFinal;
        if (pForfeit) r.purple.forfeit = true;

        (uint256 cFinal, bool cForfeit) = _tallyHiveFinal(
            matchId,
            roundId,
            _chogPlayers[matchId],
            m.chogSquadCount,
            r.chog.forfeit,
            false
        );
        r.chog.finalBeliefMicros = cFinal;
        if (cForfeit) r.chog.forfeit = true;
    }

    function _tallyHiveFinal(
        bytes32 matchId,
        uint8 roundId,
        address[] storage players,
        uint8 squadCount,
        bool alreadyForfeit,
        bool isPurpleHive
    ) internal view returns (uint256 hiveBelief, bool forfeit) {
        if (alreadyForfeit) return (0, true);
        uint256 pLen = players.length;
        if (pLen == 0) return (0, true);

        uint256[] memory aCounts = new uint256[](squadCount);
        uint256[] memory squadSizes = new uint256[](squadCount);

        for (uint8 s = 0; s < squadCount; s++) {
            uint256 size = isPurpleHive ? _purpleSquadSize[matchId][s] : _chogSquadSize[matchId][s];
            squadSizes[s] = size > 0 ? size : 1;
        }

        for (uint256 i = 0; i < pLen; i++) {
            address p = players[i];
            HiveTypes.PlayerCommitment storage pc = _commitments[matchId][roundId][p];

            if (pc.finalCommitment != bytes32(0) && !pc.finalRevealed) {
                return (0, true);
            }

            HiveTypes.Choice choice = pc.finalRevealed ? pc.finalChoice : pc.initialChoice;
            uint8 sIdx = _playerSquad[matchId][p];
            if (choice == HiveTypes.Choice.A) {
                aCounts[sIdx]++;
            }
        }

        hiveBelief = HiveScoring.meanBelief(aCounts, squadSizes);
        forfeit = false;
    }

    // -------------------------------------------------------------
    // Outcome Resolution & Match Settlement
    // -------------------------------------------------------------

    function resolveRoundOutcome(
        bytes32 matchId,
        uint8 roundId,
        HiveTypes.Choice outcome,
        bool isVoid
    ) external override onlyResolver(matchId) {
        if (roundId < 1 || roundId > 3) revert HiveTypes.InvalidRound();
        HiveTypes.RoundState storage r = _rounds[matchId][roundId];
        if (r.resolved) revert HiveTypes.RoundAlreadyResolved();

        r.outcome = outcome;
        r.isVoid = isVoid;
        r.resolved = true;

        if (isVoid || outcome == HiveTypes.Choice.None) {
            r.purple.scoreMicros = 0;
            r.chog.scoreMicros = 0;
            r.purple.wisdomLiftMicroPp = 0;
            r.chog.wisdomLiftMicroPp = 0;
        } else {
            if (r.purple.forfeit) {
                r.purple.scoreMicros = 0;
                r.purple.wisdomLiftMicroPp = 0;
            } else {
                r.purple.scoreMicros = HiveScoring.scoreMicro(r.purple.finalBeliefMicros, outcome);
                r.purple.wisdomLiftMicroPp = HiveScoring.wisdomMicro(
                    r.purple.initialBeliefMicros,
                    r.purple.finalBeliefMicros,
                    outcome
                );
            }

            if (r.chog.forfeit) {
                r.chog.scoreMicros = 0;
                r.chog.wisdomLiftMicroPp = 0;
            } else {
                r.chog.scoreMicros = HiveScoring.scoreMicro(r.chog.finalBeliefMicros, outcome);
                r.chog.wisdomLiftMicroPp = HiveScoring.wisdomMicro(
                    r.chog.initialBeliefMicros,
                    r.chog.finalBeliefMicros,
                    outcome
                );
            }
        }

        emit RoundResolved(
            matchId,
            roundId,
            outcome,
            isVoid,
            r.purple.scoreMicros,
            r.chog.scoreMicros,
            r.purple.wisdomLiftMicroPp,
            r.chog.wisdomLiftMicroPp
        );
    }

    function settleMatch(bytes32 matchId) external override onlyResolver(matchId) {
        Match storage m = _matches[matchId];
        if (m.lifecycle == HiveTypes.MatchLifecycle.Settled || m.lifecycle == HiveTypes.MatchLifecycle.NoContest) {
            revert HiveTypes.MatchAlreadySettled();
        }

        uint8 validRounds = 0;
        uint256 purpleTotal = 0;
        uint256 chogTotal = 0;

        for (uint8 i = 1; i <= 3; i++) {
            HiveTypes.RoundState storage r = _rounds[matchId][i];
            if (!r.resolved) revert HiveTypes.RoundNotResolved();
            if (!r.isVoid && r.outcome != HiveTypes.Choice.None) {
                validRounds++;
                purpleTotal += r.purple.scoreMicros;
                chogTotal += r.chog.scoreMicros;
            }
        }

        HiveTypes.MatchSettlement storage s = _settlements[matchId];
        s.purpleTotalScore = purpleTotal;
        s.chogTotalScore = chogTotal;
        s.validRounds = validRounds;

        if (validRounds < 2) {
            s.outcome = HiveTypes.SettlementOutcome.NoContest;
            s.winnerHive = 2; // None
            m.lifecycle = HiveTypes.MatchLifecycle.NoContest;
        } else if (purpleTotal == chogTotal) {
            s.outcome = HiveTypes.SettlementOutcome.Draw;
            s.winnerHive = 2; // Draw
            m.lifecycle = HiveTypes.MatchLifecycle.Settled;
        } else if (purpleTotal > chogTotal) {
            s.outcome = HiveTypes.SettlementOutcome.Win;
            s.winnerHive = 0; // Purple
            m.lifecycle = HiveTypes.MatchLifecycle.Settled;
        } else {
            s.outcome = HiveTypes.SettlementOutcome.Win;
            s.winnerHive = 1; // Chog
            m.lifecycle = HiveTypes.MatchLifecycle.Settled;
        }

        emit MatchSettled(matchId, s.outcome, s.winnerHive, purpleTotal, chogTotal, validRounds);
    }

    function voidMatch(bytes32 matchId, string calldata reason) external override onlyOperator(matchId) {
        Match storage m = _matches[matchId];
        m.lifecycle = HiveTypes.MatchLifecycle.Void;
        emit MatchVoided(matchId, reason);
    }

    // -------------------------------------------------------------
    // View Functions
    // -------------------------------------------------------------

    function getMatchLifecycle(bytes32 matchId) external view override returns (HiveTypes.MatchLifecycle) {
        return _matches[matchId].lifecycle;
    }

    function getRound(
        bytes32 matchId,
        uint8 roundId
    ) external view override returns (HiveTypes.RoundState memory) {
        return _rounds[matchId][roundId];
    }

    function getPlayerCommitment(
        bytes32 matchId,
        uint8 roundId,
        address player
    ) external view override returns (HiveTypes.PlayerCommitment memory) {
        return _commitments[matchId][roundId][player];
    }

    function getMatchSettlement(
        bytes32 matchId
    ) external view override returns (HiveTypes.MatchSettlement memory) {
        return _settlements[matchId];
    }

    function isPlayerInRoster(
        bytes32 matchId,
        address player
    ) external view override returns (bool inRoster, HiveTypes.HiveId hiveId) {
        if (_isPurple[matchId][player]) {
            return (true, HiveTypes.HiveId.Purple);
        }
        if (_isChog[matchId][player]) {
            return (true, HiveTypes.HiveId.Chog);
        }
        return (false, HiveTypes.HiveId.Purple);
    }

    function computeCommitmentHash(
        bytes32 matchId,
        uint8 roundId,
        address player,
        HiveTypes.Stage stage,
        HiveTypes.Choice choice,
        bytes32 salt
    ) public pure override returns (bytes32) {
        return keccak256(abi.encode(matchId, roundId, player, stage, choice, salt));
    }
}
