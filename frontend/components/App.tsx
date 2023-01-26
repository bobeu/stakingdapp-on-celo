import * as React from "react";
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
import { createTheme, styled, ThemeProvider } from '@mui/material/styles';
import Footer from "../components/Footer";

import { notification } from "antd"
import { useMemo, useState, useEffect, JSXElementConstructor, Key, ReactElement, ReactFragment, ReactPortal } from "react";
import getContractData from "../components/apis/contractdata";
import Address from "./Address/Address";
import { getEllipsisTxt } from "./helpers/formatters";
// import "../../index.css";
import { NotificationProps } from "../interfaces";
import { blue, purple } from "@mui/material/colors";
import sendtransaction from "./apis";
import { ethers } from "ethers";
import BigNumber from "bignumber.js";

const ValidationTextField = styled(TextField)({
  '& input:valid + fieldset': {
    borderColor: `${blue[900]}`,
    borderWidth: 2,
  },
  '& label.Mui-focused': {
    color: 'white',
  },
  '& input:invalid + fieldset': {
    borderColor: 'red',
    borderWidth: 2,
  },
  '& input:valid:focus + fieldset': {
    borderLeftWidth: 6,
    padding: '4px !important', // override inline-style
  },
});


const theme = createTheme();

export default function App() {
  const [ functionName, setFunctionName] = React.useState<string>("stake");
  const [ amountToStake, setAmountToStake] = React.useState<number>(0);
  const [ stakeId, setStakeId] = React.useState<number>(0);
  const [ roundId, setRoundId] = React.useState<number>(0);

  const { vaultAbi } = getContractData();

  const handleAmountChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setAmountToStake(Number(e.target.value));
  }

  const handleStakeIdChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setStakeId(Number(e.target.value));
  }

  const handleRoundIdChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    e.preventDefault();
    setRoundId(Number(e.target.value));
  }

  const handleContractFunction = (x:string) => setFunctionName(x);

  const displayContractFunctions = useMemo(() => {
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
      (method: { name: string; }) => method.name === "getStakeProfile" || method.name === "getAccount" 
    );
  }, [vaultAbi]);

  const openNotification = (props: NotificationProps) => {
    const { message, description } = props;

    notification.open({
      placement: "bottomRight",
      message,
      description,
      onClick: () => {
        console.log("Notification Clicked!");
      },
    });
  };

  const handleSubmit = async(event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let result;

    switch (functionName) {
      case 'stake':
        if(amountToStake === 0) return null;
        const amtInBigNumber = BigNumber(amountToStake);
        const value = ethers.utils.hexValue(ethers.utils.parseUnits(amtInBigNumber.toString()));
        result = await sendtransaction({value: value, functionName: functionName});
        console.log("Result", result);
        break;
      
      case 'unstake':
        if(roundId === 0) return null;
        result = await sendtransaction({
          roundId: BigNumber(roundId),
          stakeId: BigNumber(stakeId),
          functionName: functionName
        });
        
        case 'getStakeProfile':
          if(roundId === 0) return null;
          result = await sendtransaction({
            roundId: BigNumber(roundId),
            stakeId: BigNumber(stakeId),
            functionName: functionName
          });

      default:
        break;
    }
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
            <Box sx={{
              marginTop: 2,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div className='funcDiv'>
                <Typography variant='h5'>Transact</Typography>
                {
                  displayContractFunctions.map((item: any, id: Key) => (
                    <Button sx={{
                      '&:hover': {
                        color: 'whitesmoke',
                        width: 'fit-content',
                        border: `0.1em solid ${purple[900]}`

                      }
                    }} onClick={() => handleContractFunction(item?.name)} key={id} variant={'text'}>{item?.name}</Button>
                  ))
                }
              </div>
              <div className='funcDiv'>
                <Typography variant='h5'>Read</Typography>
                {
                  displayedViewFunctions.map((item: any, id: Key) => (
                    <Button sx={{
                      '&:hover': {
                        color: 'whitesmoke',
                        width: 'fit-content',
                        border: `0.1em solid ${purple[900]}`

                      }
                    }} onClick={() => handleContractFunction(item?.name)} key={id} variant={'text'}>{ item?.name }</Button>
                  ))
                }
              </div>
            </Box>
            {
              functionName === "stake" && <TextField
                margin="normal"
                required
                fullWidth
                id="amount"
                label="Amount to stake"
                name="amount"
                autoComplete="amount"
                type={"number"}
                autoFocus
                onChange={(e) => handleAmountChange(e)}
                sx={{border: `0.1em solid ${blue[900]}`, borderRadius: '5px'}}
                style={{color: 'whitesmoke'}}
              />
            }
            {
              (functionName === 'unstake'|| functionName === 'getStakeProfile') && 
              <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="Stake ID"
                name="stakeId"
                autoComplete="stakeid"
                type={"number"}
                autoFocus
                onChange={(e) => handleStakeIdChange(e)}
                sx={{border: `0.1em solid ${blue[900]}`, borderRadius: '5px'}}
              />
            }
            {
              (functionName === 'unstake'|| functionName === 'getStakeProfile') && 
              <TextField
                margin="normal"
                required
                fullWidth
                id="text"
                label="Round number"
                name="roundid"
                autoComplete="roundid"
                type={"number"}
                autoFocus
                onChange={(e) => handleRoundIdChange(e)}
                sx={{border: `0.1em solid ${blue[900]}`, borderRadius: '5px', textDecorationColor: 'white'}}
              />
            }
            <ValidationTextField
              label="CSS validation style"
              required
              variant="outlined"
              defaultValue="Success"
              id="validation-outlined-input"
            />
            {/* <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            /> */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ 
                mt: 3, 
                mb: 2,
                // color: orange[500]
                fontWeight: 'bold'
              }}
            >
              Send Transaction
            </Button>
          </Box>
        </Box>
        <Footer sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}
