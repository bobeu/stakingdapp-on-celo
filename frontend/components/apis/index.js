import { ethers } from "ethers";
import getContractData from "./contractdata";
import { transactionResult } from "@/interfaces";

async function sendtransaction(options) {
  const { vaultAbi, tokenAbi, vaultAddr, tokenAddr } = getContractData();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (!provider) return null;
  let result = transactionResult;
  const isUnlocked = await window.ethereum._metamask.isUnlocked();
  if (!isUnlocked) return null;
  
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Vault contract instance
    const v_contractInstance = new ethers.Contract(vaultAddr, vaultAbi, provider);
    
    // token contract instance
    const t_contractInstance = new ethers.Contract(tokenAddr, tokenAbi, provider);
    
    const signer = provider.getSigner();
    const connectedSigner = v_contractInstance.connect(signer);
    
    switch (options?.functionName) {
      case 'stake':
        const txn = await connectedSigner.stake({value: options?.value });
        // const txn = await connectedSigner.setToken(tokenAddr);
        await txn?.wait(3).then((rec) => {
          result.receipt = rec;
          result.view = false;
          options?.cancelLoading();
        });
        break;
      
      case 'unstake':
        const txn2 = await connectedSigner.unstake();
        await txn2?.wait(3).then((rec) => {
          result.receipt = rec;
          result.view = false;
          options?.cancelLoading();
        });
        break;

      case 'withdraw':
        const txn3 = await connectedSigner.withdraw();
        await txn3?.wait(3).then((rec) => {
          result.receipt = rec;
          result.view = false;
          options?.cancelLoading();
        });
        break;

      case 'getStakeProfile':
        await connectedSigner.getStakeProfile().then((res) => {
          result.readResult = res;
          result.view = true;
          options?.cancelLoading();
        });
        break;

      default:
        await t_contractInstance.balanceOf(options?.account).then((res) => {
          result.readResult = res;
          result.view = true;
          options?.cancelLoading();
        });
        break;
      }
      
    } catch (error) {
      console.log(error);
      options?.cancelLoading();
    }
  return result;
};

export default sendtransaction;