import { ethers } from "ethers";
import getContractData from "./contractdata";
import getAddresses from "./getAddresses";

async function sendtransaction(options) {
  const { vaultAbi, tokenAbi } = getContractData();
  const { vault, token} = getAddresses();

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  if (!provider) return null;
  let receipt;
  let readResult;
  const isUnlocked = await window.ethereum._metamask.isUnlocked();
  if (!isUnlocked) return null;
  
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    // Vault contract instance
    const v_contractInstance = new ethers.Contract(vault, vaultAbi, provider);
    
    // token contract instance
    const t_contractInstance = new ethers.Contract(token, tokenAbi, provider);
    
    const signer = provider.getSigner();
    const connectedSigner = v_contractInstance.connect(signer);

    switch (options?.functionName?.toLowerCase()) {
      case 'stake':
        const txn = await connectedSigner.stake({value: options?.value });
        receipt = txn?.wait(3);
        break;
      
      case 'unstake':
        const txn2 = await connectedSigner.unstake(options?.roundId, options?.stakeId);
        receipt = txn?.wait(3);
        break;

      case 'getProfile':
        const v_contractInstance = new ethers.Contract(vault, vaultAbi, provider);
        readResult = v_contractInstance.getProfile(options?.roundId, options.stakeId);
        break;

      default:
        const t_contractInstance = new ethers.Contract(token, tokenAbi, provider);
        readResult = t_contractInstance.balance(options?.account);
        break;
      } 
    } catch (error) {
      console.log(error);
    }
  return { receipt, readResult };
};

export default sendtransaction;