import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer(props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://celo.org/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
