// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "forge-std/Test.sol";
import "../src/Vault.sol";
import "../src/reward/RewardToken.sol";
import "../src/interfaces/IVault.sol";
import "../src/reward/IERC20.sol";

contract VaultTest is Test {
  Vault public vault;
  RewardToken public token;
  uint stakeAmt = 1e20 wei;

  function setUp() public {
    uint minimumStaking = 1e19 wei;
    // uint roundInterval = 1 seconds;
    uint maxSupply = 1_000_000_000 * (10**18);
    vault = new Vault(minimumStaking);
    token = new RewardToken(address(vault), maxSupply);
    vault.setToken(IERC20(token));
  }
  
  receive() external payable {}

  function testStake() public {
    uint depositTime = block.timestamp;
    (bool doneStaking) = vault.stake{value: stakeAmt}();
    assertEq(doneStaking, true);

    IVault.Staker memory stk = vault.getStakeProfile();
    assertEq(stk.depositTime, depositTime);
    assertEq(stk.celoAmount, stakeAmt);
    if(stk.account == address(0)) revert ("Zero address");
    assertEq(token.balanceOf(stk.account), 0);
  }

  function testUnstake() public {
    uint initbal = address(this).balance;
    require(vault.stake{value: stakeAmt}(), "Staking failed");
    assertEq(address(this).balance, initbal - stakeAmt);
    require(vault.unstake(), "Failed");
    IVault.Staker memory stk = vault.getStakeProfile();
    require(stk.account != address(0), "Zero alc");
    require(token.balanceOf(stk.account) == 1e15, "Zero token reward");
    assertEq(stk.celoAmount, 0);
  }

  function testWithdrawal() public {
    uint initBalance = address(this).balance;
    require(vault.stake{value: stakeAmt}(), "Staking failed");
    require(address(this).balance < initBalance, "Error");
    require(vault.unstake(), "Failed");
    vault.withdraw();
    assertEq(address(this).balance, initBalance);
    require(token.balanceOf(address(this)) > 0, "Zero token reward");
  }
}