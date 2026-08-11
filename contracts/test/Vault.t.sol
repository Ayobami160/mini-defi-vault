// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "forge-std/Test.sol";
import "../src/vault.sol";

contract VaultTest is Test {
    vault public myVault;
    address user1 = address(0x1);

    function setUp() public {
        myVault = new vault();
        vm.deal(user1, 10 ether);
    }

    function testDeposit() public {
        vm.prank(user1);
        myVault.deposit{value: 2 ether}();

        assertEq(myVault.getBalance(user1), 2 ether);
        assertEq(myVault.contractBalance(), 2 ether);
    }

    function test_RevertWhen_DepositZero() public {
        vm.prank(user1);
        vm.expectRevert("Send ETH");
        myVault.deposit{value: 0}();
    }

    function testWithdraw() public {
        vm.prank(user1);
        myVault.deposit{value: 3 ether}();

        uint256 balanceBefore = user1.balance;

        vm.prank(user1);
        myVault.withdraw();

        assertEq(myVault.getBalance(user1), 0);
        assertEq(user1.balance, balanceBefore + 3 ether);
        assertEq(myVault.contractBalance(), 0);
    }

    function test_RevertWhen_WithdrawNothing() public {
        vm.prank(user1);
        vm.expectRevert("Nothing to withdraw");
        myVault.withdraw();
    }
}