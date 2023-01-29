import React,{ useState } from "react";
import { Skeleton } from "antd";
import Blockie from "./Blockie";
import { AddressProp } from "../../interfaces";

/**
 * Returns a string of form "abc...xyz"
 * @param {string} str string to string
 * @param {number} n number of chars to keep at front/end
 * @returns {string}
 */
const getEllipsisTxt = (str: string, n: number = 6): string => {
  if (str) {
    return `${str.substr(0, n)}...${str.substr(str.length - n, str.length)}`;
  }
  return "";
};

export const Address = (props: AddressProp) => {
  const [isClicked, setIsClicked] = useState(false);
  const { 
    account, 
    isAuthenticated,
    styleAvatarLeft,
    styleAvatarRight,
    style,
    size,
    copyable,
    styleCopy,
    avatar,
    textStyle,
    display,} = props;

  if (!account)
    return (
      <Skeleton paragraph={{ rows: 1, width: "20%" }} title={false} active />
    );
  
  const Copy = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="26"
      height="26"
      viewBox="0 0 24 24"
      strokeWidth="2"
      stroke="#1780FF"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ cursor: "pointer"}}
      onClick={() => {
        navigator.clipboard.writeText(account);
        setIsClicked(true);
      }}
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M15 3v4a1 1 0 0 0 1 1h4" />
      <path d="M18 17h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h4l5 5v7a2 2 0 0 1 -2 2z" />
      <path d="M16 17v2a2 2 0 0 1 -2 2h-7a2 2 0 0 1 -2 -2v-10a2 2 0 0 1 2 -2h2" />
      <title id="copy-address">Copy Address</title>
    </svg>
  );

  return (
    <div style={style || {display: "flex", background: 'none', fontSize: '16px', gap: "1px", justifyContent: "center", alignItems: "center"}}>
      <span style={styleAvatarLeft}>{avatar === "left" && <Blockie account={account} size={size} isAuthenticated={isAuthenticated} styleAvatarLeft={styleAvatarLeft} styleAvatarRight={styleAvatarRight} style={style} copyable={copyable} styleCopy={styleCopy} avatar={avatar} display={display} />}</span>
      <a className={copyable ? "disabled" : "pointer"} style={textStyle} href={`https://explorer.celo.org/alfajores/address/${account}`} rel="noreferrer" target="_blank">{props?.size ? getEllipsisTxt(account, props?.size) : account}</a>
      <span style={styleAvatarRight}>{avatar === "right" && <Blockie account={account} size={size} isAuthenticated={isAuthenticated} styleAvatarLeft={styleAvatarLeft} styleAvatarRight={styleAvatarRight} style={style} copyable={copyable} styleCopy={styleCopy} avatar={avatar} display={display}/>}</span>
      <span style={styleCopy}>{copyable && (isClicked ? display && <Check /> : display && <Copy />)}</span>
    </div>
  );
}

const Check = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    strokeWidth="3"
    stroke="#21BF96"
    fill="none"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M5 12l5 5l10 -10" />
    <title id="copied-address">Copied!</title>
  </svg>
);
