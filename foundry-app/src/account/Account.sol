// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC20/IERC20.sol";

contract Account {
  error UnAuthorizedCaller(address);

  // Owner's address
  address private owner;

  // Reward token
  IERC20 private rewardToken;

  constructor(address _owner, IERC20 _rewardToken) {
    owner = _owner;
  }
  
  //Fallback
  receive() external payable {
    require(msg.value > 0, "");
  }

  // Only owner can call when this is invoked
  modifier onlyOwner() {
    if(msg.sender != owner) revert UnAuthorizedCaller(msg.sender);
    _;
  }

  ///@dev Withdraw Celo of @param amount : amount to withdraw from contract 
  function withdrawalCelo(uint amount) public onlyOwner {
    require(address(this).balance >= amount, "insufficient balance");
    (bool success,) = owner.call{value: amount}("");
    require(success, "");
  }

  ///@dev Withdraw reward token 
  function withdrawalERC20(uint amount) public onlyOwner {
    require(IERC20(rewardToken).balanceOf(address(thi)) >= amount, "insufficient balance");
    require(IERC20(rewardToken).tansfer(owner, amount), "Failed");
  } 
}