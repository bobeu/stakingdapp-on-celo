import BigNumber from "bignumber.js";
import { ethers } from "ethers";
import React, { CSSProperties } from "react";

export interface NotificationProps {
  message: string | JSX.Element;
  description: string | JSX.Element;
}

export interface PageProps {
  isUserAuthenticated: boolean;
  setAuthenticating: () => void;
  isAuthenticating: boolean;
  setauthentication: (x:boolean) => void;
  setAccount: (x:string) => void;
}

export interface AddressProp {
  account?: string;
  isAuthenticated?: boolean;
  styleAvatarLeft?: CSSProperties;
  styleAvatarRight?: CSSProperties;
  style?: CSSProperties;
  copyable?: boolean;
  styleCopy?: CSSProperties;
  avatar?: 'right' | 'left';
  display?: boolean;
  textStyle?: CSSProperties;
  size?: number;
  chainId?: SVGStringList;
}

export interface Explorer {
  address: string | null | undefined;
  chainId: any;
} 

export interface Profile {
  0: BigNumber;
  1: BigNumber;
  2: string;
  celoAmount: BigNumber;
  depositTime: BigNumber;
  account: string;
}

export const MockProfile = {
  0: BigNumber(0),
  1: BigNumber(0),
  2: "",
  3: "",
  depositTime: BigNumber(0),
  celoAmount: BigNumber(0),
  account: ""
}

export interface AppProps {
  account: string;
}

export interface TransactionResultProps {
  view: boolean; 
  receipt: ethers.ContractReceipt;
  readResult: BigNumber | Profile | string | number | Profile
}

export const transactionResult :TransactionResultProps = {
  view: false,
  receipt: {
    blockHash: '',
    blockNumber: 0,
    byzantium: false,
    confirmations: 0,
    contractAddress: '',
    cumulativeGasUsed: ethers.BigNumber.from(0),
    effectiveGasPrice: ethers.BigNumber.from(0),
    from: '',
    gasUsed: ethers.BigNumber.from(0),
    logs: [],
    logsBloom: '',
    to: '',
    transactionHash: '',
    transactionIndex: 0,
    type: 0,
    events: [],
    root: '',
    status: 0
  },
  readResult: MockProfile
}

export interface SpinnerProps {
  color: string;
  rest?: React.CSSProperties
}