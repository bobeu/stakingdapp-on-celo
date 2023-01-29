// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

interface IAccount {
  function withdrawCelo(address to) external;
  function withdrawERC20(address to) external;
}