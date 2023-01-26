import React, { useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import useApp from "../components/useApp";
import { PageProps } from "@/interfaces";

export default function LandingPage(props: PageProps) {
  const { connectWallet, switchNetwork, addNativeToken } = useApp();
  const { isUserAuthenticated, setauthentication } = props;

  async function handleConnect() {
    if(!isUserAuthenticated) {
      const res = await connectWallet();
      if(res) {
        setauthentication(true);
        const switchResult = await switchNetwork();
        if(switchResult) {
          // await addNativeToken();
        }
      }
    }
  }

  return (
    <>
      <div className="topDiv">
        <div className="divHeader">
          <Typography component={"main"} variant="h3">Celo StakeVerse</Typography>
        </div>
        <div className="lowerDiv">
          <Button sx={{
            width: '100%',
            height: '70px',
            borderRadius: '6px',
            color: 'GrayText',
            '&:hover': {
              border: '0.1em solid purple',
              color: 'purple',
              transition: '0.2sec ease-in-out',
              zIndex: 1
            }
          }} variant="text" onClick={handleConnect}>
            <Typography variant={"h6"} >Connect Wallet</Typography>
          </Button>
        </div>
      </div>
    </>
  );
}
