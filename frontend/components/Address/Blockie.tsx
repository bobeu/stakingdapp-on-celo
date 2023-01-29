import React from "react";
import Blockies from "react-blockies";
import { AddressProp } from "../../interfaces";
/**
 * Shows a blockie image for the provided wallet address
 * @param {*} props
 * @returns <Blockies> JSX Elemenet
 */

function Blockie(props: AddressProp) {
  const { account } = props;

  if (!account) return null;

  return (
    <Blockies
      seed={account.toLowerCase()}
      className="identicon"
      {...props}
    />
  );
}

export default Blockie;
