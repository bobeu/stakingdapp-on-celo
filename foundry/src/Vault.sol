// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin-contracts/utils/math/SafeMath.sol";
import "@openzeppelin-contracts/access/Ownable.sol";
import "../src/interfaces/IVault.sol";
import "./account/Account.sol";

contract Vault is IVault, Ownable{
    using SafeMath for uint;

    error NoStakingDetected(uint);
    error InvalidStakeId(uint);
    error NothingToUnstake();
    error NotAuthorized();
    error ZeroValue(uint);

    event Staked(uint stakeId);
    event Unstaked(uint stakeId);

    // Current round of staking
    uint public currentRound;

    // Minimum amount that can be staked
    uint public minimumStaking;

    // Minimum time interval when next round will switch.
    uint public roundInterval;

    // Last round before the current round.
    uint public lastRound;



    // Reward token
    IERC20 public token;

    ///@dev Mapping of rounds to stake vault
    mapping (uint => Staker[]) private vault;

    // Accounts
    mapping (address => address) private accounts;

    constructor (uint _minimumStaking, uint _roundIntervalInSec) {
        require(_minimumStaking > 2 ether, "Minimum staking too low");
        minimumStaking = _minimumStaking;
        roundInterval = _roundIntervalInSec * 1 seconds;
    }

    receive() external payable {
        require(msg.value > 0, "");
    }

    function setToken(IERC20 _token) public onlyOwner {
        token = _token;
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
    function stake() public payable override returns(uint roundId, uint stakeId){
        roundId = _getRound(); 
        stakeId = vault[roundId].length;
        if(msg.value < minimumStaking) revert ZeroValue(msg.value);
        address alc = _getAccount();
        if(alc == address(0)) {
            alc = address(new Account(msg.sender, token));
            accounts[msg.sender] = alc;
        }
        vault[roundId].push(Staker(
            _now(),
            msg.value,
            0,
            msg.sender
        ));

        emit Staked(vault[roundId].length - 1);
        return (roundId, stakeId);
    }

    /**@dev Unstake Celo from the vault.
     * - The stake amount at @param stakeId: is released from the
     *      vault and sent to staker's account.
     * - Stake must mature before unstaking can be allowed. 
     */
    function unstake(uint roundId, uint stakeId) public override returns(bool) {
        require(
            stakeId < vault[roundId].length && 
                roundId <= currentRound, 
            "Invalid id"
        );

        Staker memory std = vault[roundId][stakeId];
        if(std.user != msg.sender) revert NotAuthorized();
        if(std.celoAmount == 0) revert NoStakingDetected(std.celoAmount);
        require(_now() >= std.depositTime.add(roundInterval), "Stake not mature");
        delete vault[roundId][stakeId];
        address alc = _getAccount();

        (bool sent,) = alc.call{value: std.celoAmount}("");
        require(sent, "");
        uint reward = _calculateReward(std.celoAmount, vault[roundId].length);
        if(reward > 0) _mintRewardToken(alc, reward);

        emit Unstaked(stakeId);

        return true;
    }

    /**@dev Switches round if current unix timestamp is equals or 
     *        greater than last round plus switch interval.
     * @return cRound 
     * 
     */
    function _getRound() internal returns(uint cRound) {
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
    function _calculateReward(uint stakedAmt, uint totalStakers) internal pure returns(uint reward) {
        if(totalStakers == 0) return stakedAmt.div(2);
        return stakedAmt.div(totalStakers);
    }

    /// Mint rewardToken to staker on staking receipt
    function _mintRewardToken(address to, uint amount) private {
        require(IERC20(token).mint(to, amount), "");
    }

    /// Returns user's stake data
    function _getUserData(uint round, uint stakeId) internal view returns(Staker memory) {
        return vault[round][stakeId];
    }

    /// @dev Returns account associated with the caller.
    function _getAccount() internal view returns (address ) {
        return accounts[msg.sender];
    }

    function getStakeProfile(uint roundId, uint stakeId) public view returns(Staker memory stk) {
        stk = vault[roundId][stakeId];
        return stk;
    }

    ///@dev returns account of @param who : any valid address
    function getAccount(address who) public view returns(address) {
        return accounts[who];
    }
}
