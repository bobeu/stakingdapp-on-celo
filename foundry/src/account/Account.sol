// SPDX-License-Identifier: MIT
pragma solidity 0.8.17;

import "../reward/IERC20.sol";
import "../interfaces/IAccount.sol";

contract Account is IAccount {
  error UnAuthorizedCaller(address);
  event CeloReceived(uint);

  // Owner's address
  address private owner;

  // Reward token
  IERC20 private rewardToken;

  constructor(IERC20 _rewardToken) payable {
    owner = msg.sender;
    rewardToken = _rewardToken;
  }
  
  //Fallback
  receive() external payable {
    emit CeloReceived(msg.value);
  }

  // Only owner can call when this is invoked
  modifier onlyOwner() {
    if(msg.sender != owner) revert UnAuthorizedCaller(msg.sender);
    _;
  }

  ///@dev Withdraw Celo of @param amount : amount to withdraw from contract 
  function withdrawCelo(address to) external onlyOwner {
    uint balance = address(this).balance;
    (bool success,) = to.call{value: balance}("");
    require(success, "withdrawal failed");
  }

  ///@dev Withdraw reward token 
  function withdrawERC20(address to) external onlyOwner {
    uint balance = IERC20(rewardToken).balanceOf(address(this));
    if(balance >  0) require(IERC20(rewardToken).transfer(to, balance), "Failed");
  } 
}