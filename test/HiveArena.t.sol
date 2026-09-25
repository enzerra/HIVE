// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HiveArena} from "../contracts/HiveArena.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HiveArenaTest is Test {
    HiveArena public arena;
    bytes32 public matchId = keccak256("arena-founding-001");
    address public operator = address(0x10);
    address public resolver = address(0x20);

    address[] public purplePlayers;
    address[] public chogPlayers;

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
            keccak256("roster-founding-001"),
            keccak256("rules-v1"),
            operator,
            resolver,
            durations
        );

        // 4 players per Squad (Aster for Purple, Rival for Chog)
        for (uint160 i = 1; i <= 4; i++) {
            purplePlayers.push(address(0x1000 + i));
            chogPlayers.push(address(0x2000 + i));
        }

        vm.prank(operator);
        arena.setRoster(matchId, purplePlayers, chogPlayers, purplePlayers[0], chogPlayers[0]);

        vm.prank(operator);
        arena.lockMatch(matchId);

        vm.prank(operator);
        arena.startMatch(matchId);
    }

    function _playRound(
        uint8 roundId,
        HiveTypes.Choice[] memory purpleChoices,
        HiveTypes.Choice[] memory chogChoices,
        HiveTypes.Choice roundOutcome
    ) internal {
        // Think -> Deliberate
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);

        // Representatives commit arguments
        vm.prank(purplePlayers[0]);
        arena.commitArgument(matchId, roundId, keccak256("purple_argument"));
        vm.prank(chogPlayers[0]);
        arena.commitArgument(matchId, roundId, keccak256("chog_argument"));

        // Deliberate -> Commit
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);

        // Players commit initial choices
        bytes32 salt = keccak256(abi.encodePacked("salt", roundId));
        for (uint256 i = 0; i < 4; i++) {
            bytes32 pCommit = arena.computeCommitmentHash(
                matchId,
                roundId,
                purplePlayers[i],
                HiveTypes.Stage.Initial,
                purpleChoices[i],
                salt
            );
            vm.prank(purplePlayers[i]);
            arena.commitChoice(matchId, roundId, HiveTypes.Stage.Initial, pCommit);

            bytes32 cCommit = arena.computeCommitmentHash(
                matchId,
                roundId,
                chogPlayers[i],
                HiveTypes.Stage.Initial,
                chogChoices[i],
                salt
            );
            vm.prank(chogPlayers[i]);
            arena.commitChoice(matchId, roundId, HiveTypes.Stage.Initial, cCommit);
        }

        // Commit -> Reveal
        vm.warp(block.timestamp + 16);
        arena.advancePhase(matchId);

        // Players reveal initial choices
        for (uint256 i = 0; i < 4; i++) {
            vm.prank(purplePlayers[i]);
            arena.revealChoice(matchId, roundId, HiveTypes.Stage.Initial, purpleChoices[i], salt);

            vm.prank(chogPlayers[i]);
            arena.revealChoice(matchId, roundId, HiveTypes.Stage.Initial, chogChoices[i], salt);
        }

        // Reveal -> Council
        vm.warp(block.timestamp + 11);
        arena.advancePhase(matchId);

        // Council -> Revision
        vm.warp(block.timestamp + 61);
        arena.advancePhase(matchId);

        // Players submit Revision (Stay)
        for (uint256 i = 0; i < 4; i++) {
            vm.prank(purplePlayers[i]);
            arena.submitRevision(matchId, roundId, true, HiveTypes.AttributionKind.None, bytes32(0));

            vm.prank(chogPlayers[i]);
            arena.submitRevision(matchId, roundId, true, HiveTypes.AttributionKind.None, bytes32(0));
        }

        // Revision -> Resolve
        vm.warp(block.timestamp + 21);
        arena.advancePhase(matchId);

        // Resolve -> Next Round or AwaitingOutcomes
        vm.warp(block.timestamp + 6);
        arena.advancePhase(matchId);

        // Resolver settles round outcome
        vm.prank(resolver);
        arena.resolveRoundOutcome(matchId, roundId, roundOutcome, false);
    }

    function test_FullThreeRoundMatch_HappyPath() public {
        // Round 1: Purple 3 A (75%), Chog 2 A (50%), Outcome A
        // Purple score: 93.75M, Chog score: 75M
        HiveTypes.Choice[] memory p1 = new HiveTypes.Choice[](4);
        p1[0] = HiveTypes.Choice.A; p1[1] = HiveTypes.Choice.A; p1[2] = HiveTypes.Choice.A; p1[3] = HiveTypes.Choice.B;
        HiveTypes.Choice[] memory c1 = new HiveTypes.Choice[](4);
        c1[0] = HiveTypes.Choice.A; c1[1] = HiveTypes.Choice.A; c1[2] = HiveTypes.Choice.B; c1[3] = HiveTypes.Choice.B;
        _playRound(1, p1, c1, HiveTypes.Choice.A);

        // Round 2: Purple 1 A (25%), Chog 2 A (50%), Outcome B
        // Purple score: 93.75M, Chog score: 75M
        HiveTypes.Choice[] memory p2 = new HiveTypes.Choice[](4);
        p2[0] = HiveTypes.Choice.A; p2[1] = HiveTypes.Choice.B; p2[2] = HiveTypes.Choice.B; p2[3] = HiveTypes.Choice.B;
        HiveTypes.Choice[] memory c2 = new HiveTypes.Choice[](4);
        c2[0] = HiveTypes.Choice.A; c2[1] = HiveTypes.Choice.A; c2[2] = HiveTypes.Choice.B; c2[3] = HiveTypes.Choice.B;
        _playRound(2, p2, c2, HiveTypes.Choice.B);

        // Round 3: Purple 1 A (25%), Chog 1 A (25%), Outcome B
        // Purple score: 93.75M, Chog score: 93.75M
        HiveTypes.Choice[] memory p3 = new HiveTypes.Choice[](4);
        p3[0] = HiveTypes.Choice.A; p3[1] = HiveTypes.Choice.B; p3[2] = HiveTypes.Choice.B; p3[3] = HiveTypes.Choice.B;
        HiveTypes.Choice[] memory c3 = new HiveTypes.Choice[](4);
        c3[0] = HiveTypes.Choice.A; c3[1] = HiveTypes.Choice.B; c3[2] = HiveTypes.Choice.B; c3[3] = HiveTypes.Choice.B;
        _playRound(3, p3, c3, HiveTypes.Choice.B);

        // Match should be awaiting outcomes / ready for settlement
        assertEq(uint8(arena.getMatchLifecycle(matchId)), uint8(HiveTypes.MatchLifecycle.AwaitingOutcomes));

        // Settle Match
        vm.prank(resolver);
        arena.settleMatch(matchId);

        // Check final settled status
        assertEq(uint8(arena.getMatchLifecycle(matchId)), uint8(HiveTypes.MatchLifecycle.Settled));
        HiveTypes.MatchSettlement memory s = arena.getMatchSettlement(matchId);
        assertEq(s.validRounds, 3);
        assertTrue(s.purpleTotalScore > s.chogTotalScore);
        assertEq(uint8(s.outcome), uint8(HiveTypes.SettlementOutcome.Win));
        assertEq(s.winnerHive, 0); // Purple wins
    }

    function test_MatchDrawWhenScoresEqual() public {
        // Round 1: Purple 3 A, Chog 2 A, Outcome A (93.75M vs 75M)
        HiveTypes.Choice[] memory p1 = new HiveTypes.Choice[](4);
        p1[0] = HiveTypes.Choice.A; p1[1] = HiveTypes.Choice.A; p1[2] = HiveTypes.Choice.A; p1[3] = HiveTypes.Choice.B;
        HiveTypes.Choice[] memory c1 = new HiveTypes.Choice[](4);
        c1[0] = HiveTypes.Choice.A; c1[1] = HiveTypes.Choice.A; c1[2] = HiveTypes.Choice.B; c1[3] = HiveTypes.Choice.B;
        _playRound(1, p1, c1, HiveTypes.Choice.A);

        // Round 2: Purple 2 A, Chog 1 A, Outcome B (75M vs 93.75M)
        HiveTypes.Choice[] memory p2 = new HiveTypes.Choice[](4);
        p2[0] = HiveTypes.Choice.A; p2[1] = HiveTypes.Choice.A; p2[2] = HiveTypes.Choice.B; p2[3] = HiveTypes.Choice.B;
        HiveTypes.Choice[] memory c2 = new HiveTypes.Choice[](4);
        c2[0] = HiveTypes.Choice.A; c2[1] = HiveTypes.Choice.B; c2[2] = HiveTypes.Choice.B; c2[3] = HiveTypes.Choice.B;
        _playRound(2, p2, c2, HiveTypes.Choice.B);

        // Round 3: Purple 1 A, Chog 1 A, Outcome B (93.75M vs 93.75M)
        HiveTypes.Choice[] memory p3 = new HiveTypes.Choice[](4);
        p3[0] = HiveTypes.Choice.A; p3[1] = HiveTypes.Choice.B; p3[2] = HiveTypes.Choice.B; p3[3] = HiveTypes.Choice.B;
        _playRound(3, p3, p3, HiveTypes.Choice.B);

        // Settle Match
        vm.prank(resolver);
        arena.settleMatch(matchId);

        HiveTypes.MatchSettlement memory s = arena.getMatchSettlement(matchId);
        assertEq(s.purpleTotalScore, s.chogTotalScore);
        assertEq(uint8(s.outcome), uint8(HiveTypes.SettlementOutcome.Draw));
        assertEq(s.winnerHive, 2); // Draw
    }

    function test_RevertWhen_SettlingTwice() public {
        test_FullThreeRoundMatch_HappyPath();

        vm.prank(resolver);
        vm.expectRevert(HiveTypes.MatchAlreadySettled.selector);
        arena.settleMatch(matchId);
    }

    function test_NoContestWhenFewerThanTwoValidRounds() public {
        // Round 1: Valid
        HiveTypes.Choice[] memory p = new HiveTypes.Choice[](4);
        p[0] = HiveTypes.Choice.A; p[1] = HiveTypes.Choice.A; p[2] = HiveTypes.Choice.A; p[3] = HiveTypes.Choice.A;
        _playRound(1, p, p, HiveTypes.Choice.A);

        // Round 2: Void
        _playRound(2, p, p, HiveTypes.Choice.None);

        // Round 3: Void
        _playRound(3, p, p, HiveTypes.Choice.None);

        // Settle: only 1 valid round -> NoContest
        vm.prank(resolver);
        arena.settleMatch(matchId);

        assertEq(uint8(arena.getMatchLifecycle(matchId)), uint8(HiveTypes.MatchLifecycle.NoContest));
        HiveTypes.MatchSettlement memory s = arena.getMatchSettlement(matchId);
        assertEq(uint8(s.outcome), uint8(HiveTypes.SettlementOutcome.NoContest));
    }
}
