import React from 'react'
import '@/styles/globals.css';
import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: AppProps) {
  return(
    <React.Fragment>
      <Head>
        <title>Celo staking tutorial</title>
        <meta name="description" content="generic staking dapp on Celo blockchain" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Component {...pageProps} />
      </main>
    </React.Fragment>
  );
}
