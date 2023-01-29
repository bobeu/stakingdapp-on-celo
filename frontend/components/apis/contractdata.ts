import vault from "../../../foundry/out/Vault.sol/Vault.json";
import token from "../../../foundry/out/RewardToken.sol/RewardToken.json";

export default function getContractData() {
  return {
    vaultAbi: vault.abi,
    tokenAbi: token.abi,
    vaultAddr: "0x61FF31ec3bfbB8963B8180C845BAf57e5808deCF",
    tokenAddr: "0xb8e492D15471214Ba021bB53D07f4bCB40DCD235"
  }
}
