// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Test} from "forge-std/Test.sol";
import {HiveScoring} from "../contracts/libraries/HiveScoring.sol";
import {HiveTypes} from "../contracts/libraries/HiveTypes.sol";

contract HiveScoringTest is Test {
    function test_MeanBelief_EqualWeightingAndFlooring() public pure {
        uint256[] memory counts = new uint256[](3);
        counts[0] = 1;
        counts[1] = 1;
        counts[2] = 1;

        uint256[] memory sizes = new uint256[](3);
        sizes[0] = 3;
        sizes[1] = 4;
        sizes[2] = 5;

        uint256 belief = HiveScoring.meanBelief(counts, sizes);
        // Expect exact reproduction of tests/domain.test.ts: 261111
        assertEq(belief, 261111);
    }

    function test_ScoreMicro_CanonicalVector() public pure {
        // From tests/domain.test.ts: scoreMicro(261111, "A") == 45404304
        uint256 score = HiveScoring.scoreMicro(261111, HiveTypes.Choice.A);
        assertEq(score, 45404304);
    }

    function test_BrierScore_WisdomLift_And_ScoreLift() public pure {
        uint256 initialP = 550000;
        uint256 finalP = 700000;

        // Choice A outcome
        uint256 scoreA = HiveScoring.scoreMicro(finalP, HiveTypes.Choice.A);
        assertEq(scoreA, 91000000);

        int256 wisdomLiftA = HiveScoring.wisdomMicro(initialP, finalP, HiveTypes.Choice.A);
        assertEq(wisdomLiftA, 15000000); // +15 pp

        uint256 initialScoreA = HiveScoring.scoreMicro(initialP, HiveTypes.Choice.A);
        assertEq(scoreA - initialScoreA, 11250000); // score lift

        // Choice B outcome
        uint256 scoreB = HiveScoring.scoreMicro(finalP, HiveTypes.Choice.B);
        assertEq(scoreB, 51000000);

        int256 wisdomLiftB = HiveScoring.wisdomMicro(initialP, finalP, HiveTypes.Choice.B);
        assertEq(wisdomLiftB, -15000000); // -15 pp
    }

    function test_ReproduceDocumentedThreeRoundReplay() public pure {
        // Round 1: Purple 700k vs Chog 600k, Outcome A
        uint256 p1 = HiveScoring.scoreMicro(700000, HiveTypes.Choice.A);
        uint256 c1 = HiveScoring.scoreMicro(600000, HiveTypes.Choice.A);
        assertEq(p1, 91000000);
        assertEq(c1, 84000000);

        // Round 2: Purple 500k vs Chog 800k, Outcome B
        uint256 p2 = HiveScoring.scoreMicro(500000, HiveTypes.Choice.B);
        uint256 c2 = HiveScoring.scoreMicro(800000, HiveTypes.Choice.B);
        assertEq(p2, 75000000);
        assertEq(c2, 36000000);

        // Round 3: Purple 300k vs Chog 200k, Outcome B
        uint256 p3 = HiveScoring.scoreMicro(300000, HiveTypes.Choice.B);
        uint256 c3 = HiveScoring.scoreMicro(200000, HiveTypes.Choice.B);
        assertEq(p3, 91000000);
        assertEq(c3, 96000000);

        uint256 purpleTotal = p1 + p2 + p3;
        uint256 chogTotal = c1 + c2 + c3;

        // Canonical documented results: 257.00 vs 216.00
        assertEq(purpleTotal, 257000000);
        assertEq(chogTotal, 216000000);
        assertTrue(purpleTotal > chogTotal);
    }

    function test_Fuzz_ScoreMicroBounded(uint256 p, uint8 choiceRaw) public pure {
        vm.assume(p <= 1_000_000);
        vm.assume(choiceRaw == 1 || choiceRaw == 2);
        HiveTypes.Choice outcome = choiceRaw == 1 ? HiveTypes.Choice.A : HiveTypes.Choice.B;

        uint256 score = HiveScoring.scoreMicro(p, outcome);
        // Score must always be between 0 and 100_000_000 micro-points
        assertTrue(score <= 100_000_000);
    }

    function test_Fuzz_WisdomMicroBounded(uint256 initialP, uint256 finalP, uint8 choiceRaw) public pure {
        vm.assume(initialP <= 1_000_000);
        vm.assume(finalP <= 1_000_000);
        vm.assume(choiceRaw == 1 || choiceRaw == 2);
        HiveTypes.Choice outcome = choiceRaw == 1 ? HiveTypes.Choice.A : HiveTypes.Choice.B;

        int256 lift = HiveScoring.wisdomMicro(initialP, finalP, outcome);
        // Lift max range is [-100_000_000, +100_000_000]
        assertTrue(lift >= -100_000_000 && lift <= 100_000_000);
    }
}
