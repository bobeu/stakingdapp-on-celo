// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/token/ERC20/IERC20.sol";
import "openzeppelin-contracts/utils/math/SafeMath.sol";
import "./account/Account.sol";

contract Vault {
    using SafeMath for uint;

    error NoStakingDetected(uint);
    error InvalidStakeId(uint);
    error NothingToUnstake();
    error NotAuthorized();
    error ZeroValue(uint);
    error Unstaked(uint);

    event Staked(uint stakeId);

    // Current round of staking
    uint public currentRound;

    // Minimum amount that can be staked
    uint public minimumStaking;

    // Minimum time interval when next round will switch.
    uint public roundInterval;

    // Last round before the current round.
    uint public lastRound;

    // Staker's profile data
    struct Staker {
        uint depositTime;
        uint celoAmount;
        uint pendingWithdrawals;
        address user;
    }

    // Reward token
    IERC20 public token;

    ///@dev Mapping of rounds to stake vault
    mapping (uint => Staker[]) public vault;

    // Accounts
    mapping (address => address) public accounts;

    constructor (IERC20 _token, uint _minimumStaking) {
        require(_minimumStaking > 2 ether, "Minimum staking too low");
        token = _token;
        minimumStaking = _minimumStaking;
    }

    /**@dev Stake Celo for token reward.
     * - The amount of Celo sent along the call must be greater 
     *      than the minimum staking amount.
     * - We check if caller has existing account otherwise we 
     *      create a new account for them.
     * - We can make a dynamic staking i.e stakers can stake any amount
     *      Celo, anytime. Each stake is unique to another in timing and
     *      identity.
     */
    function stake() public payable {
        uint cRound = _getRound(); 
        if(msg.value < minimumStaking) revert ZeroValue(msg.value);
        address alc = _getAccount();
        if(alc == address(0)) {
            alc = address(new Account(msg.sender, token));
        }
        accounts[msg.sender] = alc;
        vault[cRound].push(Staker(
            _now(),
            msg.value,
            0,
            msg.sender
        ));

        emit Staked(vault[cRound].length - 1);
    }

    /**@dev Unstake Celo from the vault.
     * - The stake amount at @param stakeId: is released from the
     *      vault and sent to staker's account.
     * - Stake must mature before unstaking can be allowed. 
     */
    function unstake(uint roundId, uint stakeId) {
        require(
            stakeId < vault[roundId].length && 
                roundId <= currentRound, 
            "Invalid id"
        );

        Staker memory std = vault[roundId][stakeId];
        if(std.user != msg.sender) revert NotAuthorized();
        if(std.celoAmount == 0) revert NoStakingDetected(std.celoAmount);
        require(_now() >= std.depositTime.add(minimumStakingInterval), "Stake not mature");
        delete vault[roundId][stakeId];
        address alc = _getAccount();

        (bool sent,) = alc.call{value: std.celoAmount}("");
        require(sent, "");
        uint reward = _calculateReward(std.celoAmount, vault[roundId].length);
        if(reward > 0) _mintRewardToken(alc, reward);

        emit Unstaked(stakeId);
    }

    /**@dev Switches round if current unix timestamp is equals or 
     *        greater than last round plus switch interval.
     * @return currentRound 
     * 
     */
    function _getRound() internal view returns(uint cRound) {
        cRound = currentRound;
        if(_now() >= lastRound.add(roundInterval)) {
            lastRound = _now();
            currentRound ++;
            cRound = currentRound;
        }
        return cRound;
    }

    ///@dev Returns current unix time stamp
    function _now() internal view returns(uint) {
        return block.timestamp;
    }

    /**@dev Calculate reward due on staking.
     * @param stakedAmt - Exact amount staked.
     * @param totalStakers - Total number of stakers in a round.
     */
    function _calculateReward(uint stakedAmt, uint totalStakers) internal returns(uint reward) {
        if(totalStakers == 0) return stakedAmt.div(2);
        return stakedAmt.div(totalStakers);
    }

    /// Mint rewardToken to staker on staking receipt
    function _mintRewardToken(address to, uint amount) private {
        require(IERC20(token).mint(to, amount), "");
    }

    /// Return balances map of @param account: EOA
    function _getBalance(address account) internal returns(uint) {
        return balances[account];
    }

    /// Return account map of @param account : EOA
    function _getUserData() internal returns(uint) {
        return vault[msg.sender];
    }

    /// @dev Returns account associated with the caller.
    function _getAccount() internal view returns (address ) {
        return accounts[msg.sender];
    }
}
