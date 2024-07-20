import Head from "next/head";
import { Inter } from "next/font/google";
import Router from 'next/router';
import Link from 'next/link';
import styles from "@/styles/Home.module.css";
import {signIn, useSession} from 'next-auth/react'

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const {data: session, status: loading} = useSession()

  const handleSignIn = () => {
    signIn({callbackUrl: '/home'})
  }

  if(session){
    Router.push('/home');
  }else{
    return (
      <>
        <Head>
          <title>quizsalad</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <main className={`${styles.main}`}>
          <div className={styles.center}>
            <h1>
              welcome to quizsalad
            </h1>
          </div>

          <div className={styles.grid}>
              <a
                className={styles.card}
                rel="noopener noreferrer"
                onClick={handleSignIn}
              >
                <h2>
                  login <span>-&gt;</span>
                </h2>
                <p>
                  アカウントお持ちの方はこちら
                </p>
              </a>
            <Link href='/user/register'>
              <div
                className={styles.card}
                rel="noopener noreferrer"
              >
                <h2>
                  register <span>-&gt;</span>
                </h2>
                <p>
                  初めての方はこちら
                </p>
              </div>
            </Link>
          </div>
        </main>
      </>
    );
  }  
}
