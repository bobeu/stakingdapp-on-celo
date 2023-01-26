import React from 'react';
import "../styles/global.css";
import App from '../components/App';
import Home from "../components/Home";
import Layout from '../components/Layout';

export const index = () => {
  const [isUserAuthenticated, setAuthentication] = React.useState<boolean>(false);
  const setauthentication = (x:boolean) => setAuthentication(x);

  return (
    <React.Fragment>
      <Layout isUserAuthenticated={isUserAuthenticated} setauthentication={setAuthentication}>
        {
          !isUserAuthenticated ? <Home /> : <App />
        }
      </Layout>
    </React.Fragment>
  )
}
