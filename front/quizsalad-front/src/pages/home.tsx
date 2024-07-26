import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import styles from "@/styles/Home.module.css";
import {useSession} from 'next-auth/react'
import Header from '@/component/Header'

export default function BasicMenu() {
  //NextAuth.js
  const {data: session, status: loading} = useSession()

  function truncateString(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }
    return str.slice(0, maxLength) + '...';
  }

  // SnackBarの処理
  const [severityBoolean, setSeverityBoolean] = React.useState(true);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const handleClick = () => {
    setOpenSnackBar(true);
  };
  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnackBar(false);
  };

  interface TypeQuesntion {
    questionSetId: string;
    questionSetTitle: string;
    description: string;
  }
  const [questionlist, setquestionlist] = useState<TypeQuesntion[]>([])

  let token: string = session?.user.accessToken ?? ""
  useEffect(() => {
    // setquestionlist([])
    const RequestHomeInformation = async () => {
      type TypeResult = {
        status: string,
        questionsList: TypeQuesntion[],
      }
      const url = process.env.API_FRONT + '/api/v1/home'
      const Options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'token': token},
      }
      if (token != ""){
        try {
          const result = await fetch(url, Options)
          const resultJson: TypeResult = await result.json()
          if (result.status === 200) {
            const list = resultJson.questionsList
            for (let i=0; i < list.length; i++){
              if (i=0){
                setquestionlist([
                  { 
                    questionSetId: list[i].questionSetId,
                    questionSetTitle: list[i].questionSetTitle,
                    description: list[i].description,
                  },
               ]);
              } else {
                setquestionlist([
                  ...questionlist,
                  { 
                    questionSetId: list[i].questionSetId,
                    questionSetTitle: list[i].questionSetTitle,
                    description: list[i].description,
                  },
               ]);
              }
               console.log(setquestionlist)
            }
            handleClick()
          } else {
            setSeverityBoolean(false) // SnackBarの内容を警告に切り替える
          }
        } catch (error) {
          console.error("Error fetching data:", error);
          setSeverityBoolean(false)
        }
      }
    }
    RequestHomeInformation()
  }, [session?.user.accessToken])

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
       <Snackbar open={openSnackBar} autoHideDuration={5000} onClose={handleCloseSnackBar}>
        <Alert
          onClose={handleCloseSnackBar}
          severity={severityBoolean ? "success": "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {severityBoolean ? "作成済みの問題を取得しました" : "問題を取得できません。存在しないかサーバーに問題がある発生しているかもしれません。"}
        </Alert>
      </Snackbar>
      <div className={styles.MainHome}>
        <div className={styles.center}>
          <Typography variant="h2" component="h2" sx={{fontWeight: 'bold', marginTop: 5, marginLeft: 2, marginRight:2, fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif'}}>
            welcome to quizland
          </Typography>
        </div>
        <Typography variant="h5" component="h5" align="center" gutterBottom sx={{ color: 'primary.main', marginBottom: 2}}>
          作成済みの問題一覧
        </Typography>
        <Stack direction="row" justifyContent="space-evenly" alignItems="flex-start" flexWrap="wrap">
            {questionlist.map((question) => (
                  <Card variant="outlined" className={styles.QuestionCard} key={question.questionSetId}>
                    <CardContent>
                      <Typography variant="h5" component="div">
                        {truncateString(question.questionSetTitle, 13)}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {question.questionSetId}
                      </Typography>
                      <Typography variant="body2" sx={{height: "50px"}}>
                        {truncateString(question.description, 85)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small">詳細</Button>
                    </CardActions>
                  </Card>
              )
            )}
        </Stack>
      </div>  
      </>
    );
  }
}