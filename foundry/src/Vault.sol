// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.17;

import "@openzeppelin-contracts/utils/math/SafeMath.sol";
import "@openzeppelin-contracts/access/Ownable.sol";
import "../src/interfaces/IVault.sol";
import "../src/interfaces/IAccount.sol";
import "./account/Account.sol";

contract Vault is IVault, Ownable{
    using SafeMath for uint;

    error NoStakingDetected(uint);
    error InvalidStakeId(uint);
    error NothingToUnstake();
    error NotAuthorized();
    error ZeroValue(uint);

    event Staked(uint);
    event Unstaked(uint);

    // Minimum amount that can be staked
    uint public minimumStaking;

    // Total stakers
    uint public stakers;

    // Reward token
    IERC20 public token;

    ///@dev Mapping of rounds to stake vault
    mapping (address => Staker) private vault;

    constructor (uint _minimumStaking) {
        require(_minimumStaking > 0, "Minimum staking too low");
        minimumStaking = _minimumStaking;
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
    function stake() public payable override returns(bool){
        address alc;
        Staker memory stk = _getStakeProfile(msg.sender);
        if(msg.value < minimumStaking) revert ZeroValue(msg.value);
        alc = stk.account;
        if(alc == address(0)) {
            alc = address(new Account(token));
        }

        if(stk.celoAmount > 0) {
            _unstake(alc, stk.celoAmount, stk.depositTime);
        }
        vault[msg.sender] = Staker(_now(), msg.value, alc);
        stakers ++;
        emit Staked(msg.value);

        return true;
    }

    function _unstake(address alc, uint value, uint depositTime) private {
        stakers --;
        vault[msg.sender].celoAmount = 0;
        (bool sent,) = alc.call{value: value}("");
        require(sent, "Transfer rejected");
        uint reward = _calculateReward(value, depositTime);
        if(reward > 0) _mintRewardToken(alc, reward);

        emit Unstaked(value);
    }

    /**@dev Unstake Celo from the vault.
     */
    function unstake() public override returns(bool) {
        Staker memory stk = vault[msg.sender];
        if(stk.celoAmount == 0) revert NoStakingDetected(stk.celoAmount);
        require(stk.account != address(0), "Account anomally detected");
        _unstake(stk.account, stk.celoAmount, stk.depositTime);

        return true;
    }

    ///@dev Returns current unix time stamp
    function _now() internal view returns(uint) {
        return block.timestamp;
    }

    /**@dev Calculate reward due on staking.
     * @param stakedAmt - Exact amount staked.
     * @param depositTime - Time stake was made.
     * 
     * To get the reward, we compare the current unixtime to the time staking
     * was performed to get the time difference. If time difference is greater 
     * than 1 minute, multiplier will increase otherwise it defaults to 1.
     */
    function _calculateReward(uint stakedAmt, uint depositTime) internal view returns(uint reward) {
        uint divisor = 60;
        uint curTime = _now();
        if(curTime == depositTime) {
            reward = 10 ** 15;
            return reward;
        }

        if(curTime > depositTime) {
            uint timeDiff = curTime.sub(depositTime);
            if(timeDiff > 0){
                reward = timeDiff.mul(stakedAmt).div(divisor); // Weighted reward
            } else {
                reward = 1e15;
            }

        }
        return reward;
    }

    /// Mint rewardToken to staker on staking receipt
    function _mintRewardToken(address to, uint amount) private {
        require(IERC20(token).mint(to, amount), "");
    }

    function _getStakeProfile(address who) internal view returns(Staker memory) {
        return vault[who];
    } 

    function getStakeProfile() public view returns(Staker memory stk) {
        return _getStakeProfile(msg.sender);
    }

    ///@dev returns account of @param who : any valid address
    function withdraw() public {
        address alc = _getStakeProfile(msg.sender).account;
        IAccount(alc).withdrawCelo(msg.sender);
        IAccount(alc).withdrawERC20(msg.sender);
    }
}
