// import * as React from "react";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Footer from "../components/Footer";

import { notification } from "antd"
import { useMemo, useState, useEffect } from "react";
import getContractData from "../components/apis/contractdata";
// import contractInfo from "contracts/verifyKandaContract";
import Address from "./Address/Address";
import { getEllipsisTxt } from "./helpers/formatters";
import "../../index.css";

const theme = createTheme();

export default function App() {
  const { vaultAbi } = getContractData();

  const displayedContractFunctions = useMemo(() => {
    let filt: any;
    if (!vaultAbi) return [];
    filt = vaultAbi.filter((method) => method["type"] === "function");
    return filt.filter(
      (method: { name: string; }) => method.name === "stake" || 
      method.name === "unstake"
    );
  }, [vaultAbi]);

  const displayedViewFunctions = useMemo(() => {
    let filt: any;
    if (!vaultAbi) return [];
    filt = vaultAbi.filter((method) => method["type"] === "function");
    return filt.filter(
      (method) => method.name === "getProfile" 
    );
  }, [vaultAbi]);

  const openNotification = ({ message, description }) => {
    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Stake $Celo
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="amount"
              label="Amount to stake"
              name="amount"
              autoComplete="amount"
              type={"number"}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="round number"
              label="Round number"
              name="roundid"
              autoComplete="roundid"
              type={"number"}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="stakeid"
              label="Stake Id"
              name="stake Id"
              autoComplete="stakeId"
              type={"number"}
              autoFocus
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Send Transaction
            </Button>
            {/* <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid> */}
          </Box>
        </Box>
        <Footer sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
