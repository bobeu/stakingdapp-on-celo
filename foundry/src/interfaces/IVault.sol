// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IVault {
  // Staker's profile data
  struct Staker {
      uint depositTime;
      uint celoAmount;
      address account;
  }

  function stake() external payable returns(bool);
  function unstake() external returns(bool);

}