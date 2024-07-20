import * as React from 'react';
import Head from 'next/head'
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import styles from "@/styles/Home.module.css";
import Router from 'next/router';
import {signOut, useSession} from 'next-auth/react'
import Header from '@/component/Header'

export default function BasicMenu() {
  //NextAuth.js
  const {data: session, status: loading} = useSession()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleLogoutClick = () => {
    signOut()
  };

  if (!session) {
    return null
  } else {
    return (
      <>      
        <Head>
          <title>quizsalad(ホーム)</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
       <Header site="home" />
        <div className={styles.Main}>
          <div className={styles.center}>
            <h1>
              welcome to quizland
            </h1>
          </div>
        </div>  
      </>
    );
  }
}