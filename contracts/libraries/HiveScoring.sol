// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {HiveTypes} from "./HiveTypes.sol";

library HiveScoring {
    uint256 public constant SCALE = 1_000_000;
    uint256 public constant SCALE_SQUARED = 1_000_000_000_000;

    /**
     * @notice Calculate mean belief across squads
     * @param aCounts Array of vote counts for Option A per squad
     * @param squadSizes Array of total roster sizes per squad
     * @return hiveBelief Calculated mean belief in micro-units [0, 1_000_000]
     */
    function meanBelief(
        uint256[] memory aCounts,
        uint256[] memory squadSizes
    ) internal pure returns (uint256 hiveBelief) {
        uint256 length = aCounts.length;
        if (length == 0 || length != squadSizes.length) {
            revert HiveTypes.InvalidChoice();
        }

        uint256 sumSquadBeliefs = 0;
        for (uint256 i = 0; i < length; i++) {
            uint256 size = squadSizes[i];
            if (size == 0 || aCounts[i] > size) {
                revert HiveTypes.InvalidChoice();
            }
            sumSquadBeliefs += (aCounts[i] * SCALE) / size;
        }

        hiveBelief = sumSquadBeliefs / length;
    }

    /**
     * @notice Calculate canonical quadratic Brier score in micro-points
     * @dev Score = 100 * (1 - (p - y)^2) scaled to micro-points (10^6)
     * @param p Belief probability in micro-units [0, 1_000_000]
     * @param outcome Actual verified outcome (Choice.A or Choice.B)
     * @return score Calculated score in micro-points [0, 100_000_000]
     */
    function scoreMicro(
        uint256 p,
        HiveTypes.Choice outcome
    ) internal pure returns (uint256 score) {
        if (outcome != HiveTypes.Choice.A && outcome != HiveTypes.Choice.B) {
            return 0;
        }

        uint256 y = (outcome == HiveTypes.Choice.A) ? SCALE : 0;
        uint256 d = (p >= y) ? (p - y) : (y - p);

        // 100 * SCALE * (SCALE^2 - d^2) / SCALE^2
        uint256 dSquared = d * d;
        if (dSquared >= SCALE_SQUARED) {
            return 0;
        }

        uint256 diff = SCALE_SQUARED - dSquared;
        score = (100 * SCALE * diff) / SCALE_SQUARED;
    }

    /**
     * @notice Calculate Wisdom Lift in signed micro percentage points (micro-pp)
     * @dev Lift = 100 * (|initial - y| - |final - y|)
     * @param initial Initial belief in micro-units
     * @param finalP Final belief in micro-units
     * @param outcome Actual verified outcome (Choice.A or Choice.B)
     * @return liftPp Wisdom Lift in signed micro-pp (positive = closer to truth)
     */
    function wisdomMicro(
        uint256 initial,
        uint256 finalP,
        HiveTypes.Choice outcome
    ) internal pure returns (int256 liftPp) {
        if (outcome != HiveTypes.Choice.A && outcome != HiveTypes.Choice.B) {
            return 0;
        }

        uint256 y = (outcome == HiveTypes.Choice.A) ? SCALE : 0;
        uint256 initialDist = (initial >= y) ? (initial - y) : (y - initial);
        uint256 finalDist = (finalP >= y) ? (finalP - y) : (y - finalP);

        liftPp = 100 * (int256(initialDist) - int256(finalDist));
    }
}
