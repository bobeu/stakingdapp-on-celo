import React from "react";
import { ethers } from "ethers";

const alfajores = {
  chainId: "0xAEF3",
  chainName: "Alfajores",
  rpcUrls: ["https://alfajores-forno.celo-testnet.org"]
};

// window.document.getElementById('requestPermissionsButton', requestPermissions);
async function addToken(tokenAddress = String, imageUrl = String, symbol = String, type = String) {
  await window.ethereum
    .request({
      method: "wallet_watchAsset",
      params: {
        type: type || "ERC20",
        options: {
          address: tokenAddress,
          symbol: symbol,
          decimals: 18,
          image: imageUrl
        }
      }
    })
    .then(success => {
      if (success) {
        console.log(`${symbol} was added`);
      } else {
        throw new Error("Something went wrong.");
      }
    })
    .catch(console.error);
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
  const [web3Enable, setEnable] = React.useState(false);
  const [isAuthenticated, setAuthenticated] = React.useState(false);
  const [wallet, setAccount] = React.useState("");
  const { setMessage } = useAppContext();

  async function getAccount() {
    let account = "";
    let rejectedRequestError = "";
    await window.ethereum
      .request({ method: "eth_requestAccounts" })
      .then(newAccounts => {
        if (wallet !== newAccounts[0]) {
          account = newAccounts[0];
        }
      })
      .catch(error => {
        if (error.code === 4001) {
          // EIP-1193 userRejectedRequest error
          rejectedRequestError = error?.message;
        } else {
          console.error(error);
        }
      });
  }

  async function requestWalletConnectPermissions() {
    await window.ethereum
      .request({
        method: "wallet_requestPermissions",
        params: [{ eth_accounts: {} }]
      })
      .then(async permissions => {
        const accountsPermission = permissions.find(permission => permission.parentCapability === "eth_accounts");
        if (accountsPermission) {
          await window.ethereum._metamask.isUnlocked().then(isUnlocked => setEnable(isUnlocked));
        } else {
          await getAccount();
        }
      })
      .catch(error => {
        // if (error.code === 4001) {
        // EIP-1193 userRejectedRequest error
        console.log("Permissions needed to continue.");
        console.error(error);
      });
    // return done;
  }

  return {
    connectWallet: requestWalletConnectPermissions,
    switchNetwork: switchNetwork,
    addNativeToken: addToken,
  };
};

export default useQuatre;
