import { Button, Card, Input, Typography, Form, notification } from "antd"
import { useMemo, useState, useEffect } from "react";
import getContractData from "../apis/contractdata";
// import contractInfo from "contracts/verifyKandaContract";
import Address from "../Address/Address";
import { getEllipsisTxt } from "../helpers/formatters";
import "../../index.css";

export default function Staking() {
  const [responses, setResponses] = useState<Object>({});
  const [contractAddress, setContractAddress] = useState<string>("");
  const [currentAccount,] = useState<string>("");
  // const { contractName, abi } = contractInfo;
  const { vaultAbi } = getContractData();

  


  return (
   
  );
}



// openNotification({
//   message: "🔊 New Transaction",
//   description: `${hash}`,
// });