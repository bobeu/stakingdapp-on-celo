import vault from "../../../foundry/out/Vault.sol/Vault.json";
import token from "../../../foundry/out/RewardToken.sol/RewardToken.json";

export default function getContractData() {
  return {
    vaultAbi: vault.abi,
    tokenAbi: token.abi
  }
}