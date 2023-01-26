import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';

interface LayoutProps {
  setauthentication: (x:boolean) => void;
  isUserAuthenticated: boolean;
  children: React.ReactNode | any;
}

export default function Layout(props: LayoutProps) {
  const { setauthentication, isUserAuthenticated, children } = props;

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            News
          </Typography>
          {
            isUserAuthenticated
          }
          <Button color="inherit">ConnectWallet</Button>
        </Toolbar>
      </AppBar>
      { children }
    </Box>
  );
}
