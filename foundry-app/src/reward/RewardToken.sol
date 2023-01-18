// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC20/ERC20.sol";
import "./account/Account.sol";

contract RewardToken is ERC20 {

  constructor (address to) ERC20("RewardToken", "ITK") {
    uint supply = 1_000_000_000 * (10**18);
    _mint(to, supply);
  }
  
}