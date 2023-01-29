import React from 'react';
import App from '../components/App'
import LandingPage from "../components/LandingPage"

export default function Home() {
  const [isUserAuthenticated, setAuthentication] = React.useState<boolean>(false);
  const setauthentication = (x:boolean) => setAuthentication(x);
  const [account, setAccount] = React.useState<string>("");
  const [isAuthenticating, setAuthenticating] = React.useState<boolean>(false);

  const setaccount = (x:string) => setAccount(x);
  const toggleAuthenticating = () => setAuthenticating(!isAuthenticating);
  // style={{background: 'rgb(2, 2, 3)'}}
  return (
    <div >
      {
        !isUserAuthenticated ? <LandingPage
          isAuthenticating={isAuthenticating}
          setAuthenticating={toggleAuthenticating}
          isUserAuthenticated={isUserAuthenticated} 
          setauthentication={setauthentication}
          setAccount={setaccount}
        /> : <App account={account} />
      }
    </div>
  )
}