import React from "react";
import { ethers } from "ethers";
import getContractData from "./apis/contractdata";

function toHexValue(x) {
  const hexVal = ethers.utils.hexlify(x);
  console.log("HexVal:",hexVal)
  return hexVal;
}

const alfajores = {
  chainId: toHexValue(44787),
  chainName: "Celo testnet",
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"]
};

// window.document.getElementById('requestPermissionsButton', requestPermissions);
async function addToken() {
  const { tokenAddr } = getContractData();
  console.log("TokenAddr", tokenAddr);

  try {
    await window.ethereum
    .request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        options: {
          address: tokenAddr,
          symbol: 'RTK',
          decimals: 18,
          image: "/celologopng.png"
        }
      }
    })
    .then(success => {
      if (success) {
        console.log('RTK was added');
      } else {
        throw Error("Something went wrong");
      }
    })
  } catch (error) {
    console.log("Error", error);
  }
}

async function switchNetwork() {
  let done = false;
  try {
    await ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: alfajores.chainId }]
    }).then(() => done = true);
    
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError?.code === 4902) {
      console.log(`SwitchError: ${switchError}`);
      try {
        await ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: alfajores.chainId,
              chainName: alfajores.chainName,
              rpcUrls: alfajores.rpcUrls,
            },
          ],
        }).then(() => done = true );
      } catch (addError) {
        console.log("Could not add network", addError);
      }
    }
    console.log("There was an error trying to switch network", switchError);
  }
  return done;
}

const useApp = () => {
  async function getAccount() {
    let account = "";
    let rejectedRequestError = "";
    try {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(newAccounts => {
          if (newAccounts[0]) {
            account = newAccounts[0];
          }
        })
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        rejectedRequestError = error;
      } else {
        console.error(error);
      }
    }
    return { account, rejectedRequestError };
  }

  async function requestWalletConnectPermissions() {
    let done = false;
    let address = "";
    // if(!ethereum.isMetamask) return alert("Metamask is not installed. Visit https://metamask.io");
    if(typeof window.ethereum === undefined) return alert("Metamask is not installed");

    try {
      await window.ethereum
        .request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        })
        .then(async permissions => {
          const accountsPermission = permissions.find(permission => permission.parentCapability === "eth_accounts");
          if (accountsPermission) {
            done = true;
            const { account } = await getAccount();
            if(account) {
              address = account;
              done = await switchNetwork();
            }
            // await window.ethereum._metamask.isUnlocked().then((isUnlocked) => { done = isUnlocked; } );
          }
        })
    } catch (error) {
      // if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log("Permissions needed to continue.");
      console.error(error);
    }
    return { done, address };
  }

  return {
    connectWallet: requestWalletConnectPermissions,
    switchNetwork: switchNetwork,
    addNativeToken: addToken,
  };
};

export default useApp;
