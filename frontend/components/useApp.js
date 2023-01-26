import React from "react";
import { ethers } from "ethers";
import getAddresses from "./apis/getAddresses";

const alfajores = {
  chainId: "0xAEF3",
  chainName: "Alfajores",
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"]
};

// window.document.getElementById('requestPermissionsButton', requestPermissions);
async function addToken() {
  const { token } = getAddresses();

  try {
    await window.ethereum
    
    .request({
      method: "wallet_watchAsset",
      params: {
        type: "ERC20",
        // options: {
          address: token,
          symbol: "RTK",
          decimals: 18,
          image: ""
        // }
      }
    })
    .then(success => {
      if (success) {
        console.log(`${symbol} was added`);
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
    });
    done = true;
  } catch (switchError) {
    // This error code indicates that the chain has not been added to MetaMask.
    if (switchError) {
      console.log(`SwitchError: ${switchError}`);
      try {
        await ethereum.request({
          method: "wallet_addEthereumChain",
          params: [alfajores.chainId]
        });
        done = true;
      } catch (addError) {
        console.log("Could not add network");
      }
    }
  }
  return done;
}

const useQuatre = () => {
  async function getAccount() {
    let account = "";
    let rejectedRequestError = "";
    try {
      await window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then(newAccounts => {
          if (wallet !== newAccounts[0]) {
            account = newAccounts[0];
          }
        })
    } catch (error) {
      if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        rejectedRequestError = error?.message;
      } else {
        console.error(error);
      }
    }
    return { account, rejectedRequestError };
  }

  async function requestWalletConnectPermissions() {
    let done = false;
    try {
      await window.ethereum
        .request({
          method: "wallet_requestPermissions",
          params: [{ eth_accounts: {} }]
        })
        .then(async permissions => {
          const accountsPermission = permissions.find(permission => permission.parentCapability === "eth_accounts");
          if (accountsPermission) {
            await window.ethereum._metamask.isUnlocked().then((isUnlocked) => { done = isUnlocked; } );
          } else {
            const { account } = await getAccount();
            if(account) done = true;
          }
        })
    } catch (error) {
      // if (error.code === 4001) {
      // EIP-1193 userRejectedRequest error
      console.log("Permissions needed to continue.");
      console.error(error);
    }
    return done;
  }

  return {
    connectWallet: requestWalletConnectPermissions,
    switchNetwork: switchNetwork,
    addNativeToken: addToken,
  };
};

export default useQuatre;
