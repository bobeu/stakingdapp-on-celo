// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "../account/Account.sol";
import "./ERC20.sol";

contract RewardToken is ERC20 {
  uint public maxSupply;

  address public owner;

  constructor (address _owner, uint _maxSupply) ERC20("RewardToken", "RTK") {
    require(_maxSupply > 0, "Zero supply");
    maxSupply = _maxSupply * (10**18);
    owner = _owner;
  }

  function mint(address to, uint amount) external returns(bool) {
    require(msg.sender == owner, "Not Authorized");
    _mint(to, amount);
    return true;
  }
  
}