// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Script.sol";
import "../src/vault.sol";

contract DeployVault is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        
        vm.startBroadcast(deployerPrivateKey);
        
        vault myVault = new vault();
        
        console.log("Vault deployed at:");
        console.log(address(myVault));
        
        vm.stopBroadcast();
    }
}