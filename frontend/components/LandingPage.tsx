import React, { useState} from "react";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import useApp from "../components/useApp";
import { PageProps } from "@/interfaces";
import { orange, purple } from "@mui/material/colors";
import Footer from "./Footer";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";

export default function LandingPage(props: PageProps) {
  const { connectWallet, addNativeToken } = useApp();
  const { 
    isUserAuthenticated, 
    setauthentication, 
    setAccount, 
    isAuthenticating,
    setAuthenticating } = props;

  async function handleConnect() {
    if(!isUserAuthenticated) {
      setAuthenticating();
      const result = await connectWallet();
      console.log("Address", result?.address);
      if(result?.done === true) {
        setAccount(result?.address);
        setAuthenticating();
        setauthentication(true);
        await addNativeToken();
      } else {
        setAuthenticating();
      }
    }
  }

  return (
    <React.Fragment>
      <Container maxWidth='md'>
        <div className="topDiv">
          <Stack className="divHeader" textAlign={"revert-layer"} >
            <Typography component={"main"} variant="h1">Celo StakeVerse</Typography>
            <Typography component={"main"} variant="h3">Stake Celo to earn RTK Token</Typography>
            <Typography component={"main"} variant="h5">Made by <span>
              <Link color="inherit" href="https://github.com/bobeu" style={{color: orange[600]}}>
                Isaac Jesse 
              </Link> a.k.a Bobelr | Bobeu</span>
            </Typography>
            <Link color="inherit" href="https://github.com/bobeu/stakingdapp-on-celo" style={{color: purple[200]}}>
              Source code
            </Link>
          </Stack>
          <div className="divHeader"></div>
          <div className="lowerDiv">
            <Button disabled={isAuthenticating} sx={{
              width: '50%',
              height: '120px',
              border: '0.1em solid whitesmoke',
              color: 'whitesmoke',
              borderRadius: '6px',
              textAnchor: 'start',
            }} variant="text" onClick={handleConnect}
              className='connectButton'
            >
              <Typography variant={"h6"} >Connect Wallet</Typography>
            </Button>
          </div>
        </div>
      </Container>
      <Footer sx={{ mt: 8, mb: 4 }} />
    </React.Fragment>
  );
}
