// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

interface IVault {
  // Staker's profile data
  struct Staker {
      uint depositTime;
      uint celoAmount;
      uint pendingWithdrawals;
      address user;
  }

  function stake() external payable returns(uint, uint);
  function unstake(uint roundId, uint stakeId) external returns(bool);

}