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
  const { connectWallet, switchNetwork, addNativeToken } = useApp();
  const { 
    isUserAuthenticated, 
    setauthentication, 
    setAccount, 
    isAuthenticating,
    setAuthenticating } = props;

  async function handleConnect() {
    if(!isUserAuthenticated) {
      setAuthenticating();
      const {done, address } = await connectWallet();
      console.log("Address",address);
      if(done) {
        setAccount(address);
        setAuthenticating();
        setauthentication(true);
        const switchResult = await switchNetwork();
        if(switchResult) {
          await addNativeToken();
        }
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
              // '&:hover': {
              //   padding: 2,
              //   color: purple[900],
              //   background: 'whitesmoke',
              //   transition: '0.2sec ease-in-out',
              // }
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
