import React from "react";
import { ethers } from "ethers";
import getContractData from "./apis/contractdata";

const alfajores = {
  chainId: "0xAEF3",
  chainName: "Alfajores",
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
        // options: {
          address: tokenAddr,
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
        rejectedRequestError = error?.message;
      } else {
        console.error(error);
      }
    }
    return { account, rejectedRequestError };
  }

  async function requestWalletConnectPermissions() {
    let done = false;
    let address = "";

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
            address = account;
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
