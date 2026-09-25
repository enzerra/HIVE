// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";
import {HiveArena} from "../contracts/HiveArena.sol";
import {HivePulse} from "../contracts/HivePulse.sol";

contract DeployScript is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        HiveArena arena = new HiveArena();
        console.log("HiveArena deployed to:", address(arena));

        HivePulse pulse = new HivePulse();
        console.log("HivePulse deployed to:", address(pulse));

        vm.stopBroadcast();
    }
}
