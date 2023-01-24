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
  uint public stakeCounter;

  struct Ids {
    uint roundId;
    uint stakeId;
  }
p-on-celo\foundry> forge create --rpc-url https://alfajores-forno.celo-testnet.org --constructor-args 10000000000000000000 2 --private-key dc9d366572e372bb47267078e1c527bee0024327e7f33dfaa482036d1f3ed129 src/Vault.sol:Vault
[⠰] Compiling...
No files changed, compilation skipped
Deployer: 0xA7B2387bF4C259e188751B46859fcA7E2043FEFD
Deployed to: 0x346Ab06EDeB0f143fe7A3FBe24a78639B7F626f7
Transaction hash: 0x5f20ab5838f3710de8e2c2bed9a24b8e11bb25a4a6fa9004e55d2f69e4029c72
PS C:\Users\FVO_MMILLLER\Desktop\hackathons\stakingdapp-on-celo\foundry>
// forge create --rpc-url https://alfajores-forno.celo-testnet.org --constructor-args 10000000000000000000 2 --private-key dc9d366572e372bb47267078e1c527bee0024327e7f33dfaa482036d1f3ed129 src/RewardToken.sol:RewardToke
  mapping(uint => Ids) public stakeInfo;

  function setUp() public {
    uint minimumStaking = 1e19 wei;
    // uint roundInterval = 1 seconds;
    uint maxSupply = 1_000_000_000 * (10**18);
    vault = new Vault(minimumStaking, 0);
    token = new RewardToken(address(vault), maxSupply);
    vault.setToken(IERC20(token));
  }
  
  function testStake() public {
    uint stakeAmt = 1e20 wei;
    uint depositTime = block.timestamp;
    (uint roundId, uint stakeId) = vault.stake{value: stakeAmt}();
    assertEq(roundId, 1);
    assertEq(stakeId, 0);
    stakeCounter ++;
    stakeInfo[stakeCounter] = Ids({roundId: roundId, stakeId: stakeId});
    address account = vault.getAccount(address(this));

    Ids memory ids = stakeInfo[stakeCounter];
    // uint round = vault.currentRound();
    IVault.Staker memory stk = vault.getStakeProfile(ids.roundId, ids.stakeId);
    assertEq(ids.roundId, 1);
    assertEq(stk.user, address(this));
    assertEq(stk.depositTime, depositTime);
    assertEq(stk.celoAmount, stakeAmt);
    if(account == address(0)) revert ("Zero address");
    assertEq(token.balanceOf(account), 0);
  }

  function testUnstake() public {
    uint stakeAmt = 1e20 wei;
    (uint roundId, uint stakeId) = vault.stake{value: stakeAmt}();
    // Ids memory ids = stakeInfo[stakeCounter];
    require(vault.unstake(roundId, stakeId), "Failed");
    address account = vault.getAccount(address(this));
    IVault.Staker memory stk = vault.getStakeProfile(roundId, stakeId);
    require(token.balanceOf(account) > 0, "Zero token reward");
    assertEq(stk.celoAmount, 0);
  }
}