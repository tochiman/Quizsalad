import React, { useEffect, useState } from 'react';
import Head from 'next/head'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import CloseIcon from '@mui/icons-material/Close';
import CircularProgress from '@mui/material/CircularProgress';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
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
import Router  from 'next/router';
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

  // プログレスバーの管理
  const [ProgressAPI, setProgressAPI] = React.useState(false)
  const [linearProgressDeleteQuestion, setLinearProgressDeleteQuestion] = React.useState(false)
  
  // SnackBarの処理
  const [severityBoolean, setSeverityBoolean] = React.useState(true);
  const [openSnackBar, setOpenSnackBar] = React.useState(false);
  const handleClick = () => {
    setOpenSnackBar(true);
  };
  const handleCloseSnackBar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnackBar(false);
  };
  const [severityBooleanCardDetail, setSeverityBooleanCardDetail] = React.useState(true);
  const [openSnackBarCardDetail, setOpenSnackBarCardDetail] = React.useState(false);
  const handleClickCardDetail = () => {
    setOpenSnackBarCardDetail(true);
  };
  const handleCloseSnackBarCardDetail = (event?: React.SyntheticEvent | Event, reason?: string) => {
    setOpenSnackBarCardDetail(false);
  };
  
  // Modal用のCSS
  const styleModal = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'white',
    border: '2px solid white',
    boxShadow: 24,
    p: 4,
  };
  
  // modal用
  const [openDetailModal, setOpenDetailModal] = React.useState(false);
  const [Title, setTitle] = React.useState("");
  const [Id, setId] = React.useState("");  
  const handleOpenDetailModal = (id : string, title: string) => {
    setOpenDetailModal(true)
    setId(id)
    setTitle(title)
  }
  const handleCloseDetailModal = () => setOpenDetailModal(false);

  interface TypeQuesntion {
    questionSetId: string;
    questionSetTitle: string;
    description: string;
  }
  const [questionlist, setquestionlist] = useState<TypeQuesntion[]>([])
  type TypeResult = {
    status: string,
    questionsList: TypeQuesntion[],
  }

  useEffect(() => {
    setProgressAPI(true)
    let token: string = session?.user.accessToken ?? ""
    const RequestHomeInformation = async () => {
      const url = process.env.API_FRONT + '/api/v1/home'
      const Options = {
        method: 'GET',
        headers: {'Content-Type': 'application/json', 'token': token},
      }
      if (token != ""){
        try {
          setquestionlist([])
          const result = await fetch(url, Options)
          const resultJson: TypeResult = await result.json()
          if (result.status === 200) {
            const list = resultJson.questionsList
            for (let i = 0; i < list.length; i++){
              if (i === 0){
                setquestionlist([
                  { 
                    questionSetId: list[i].questionSetId,
                    questionSetTitle: list[i].questionSetTitle,
                    description: list[i].description,
                  },
               ]);
              } else {
                setquestionlist((prevlist) => [
                  ...prevlist,
                  { 
                    questionSetId: list[i].questionSetId,
                    questionSetTitle: list[i].questionSetTitle,
                    description: list[i].description,
                  },
               ]);
              }
            }
            handleClick()
          } else {
            setSeverityBoolean(false) // SnackBarの内容を警告に切り替える
          }
        } catch (error) {
          setSeverityBoolean(false)
        } finally {
          setProgressAPI(false)
        }
      }
    }
    RequestHomeInformation();
  }, [session?.user.accessToken])

  const RequestDeleteQuestion = async (id: string) => {
    setLinearProgressDeleteQuestion(true)
    let token: string = session?.user.accessToken ?? ""
    const url = process.env.API_FRONT + '/api/v1/question/delete'
    const Options = {
      method: 'DELETE',
      headers: {'Content-Type': 'application/json', 'token': token},
      body: JSON.stringify({
        questionSetId: id,
      }),
    }
    if (token != ""){
      try {
        const result = await fetch(url, Options)
        if (result.status === 200)  {
          Router.reload()
          setSeverityBooleanCardDetail(true)
          handleClickCardDetail()
        }
        else if (result.status === 400 || result.status === 500) setSeverityBooleanCardDetail(false) 
      } catch (error) {
        setSeverityBooleanCardDetail(false)
      }
      finally {
        setLinearProgressDeleteQuestion(false)
      }
    }
  }

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
      <Snackbar open={openSnackBarCardDetail} autoHideDuration={5000} onClose={handleCloseSnackBarCardDetail}>
        <Alert
          onClose={handleCloseSnackBarCardDetail}
          severity={severityBooleanCardDetail ? "success": "error"}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {severityBooleanCardDetail ? "問題セットを削除しました。" : "正常にリクエストを完了できませんでした。"}
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
          {ProgressAPI ?  <CircularProgress color="primary" />: 
            questionlist.length === 0 ? 
            <Typography variant="h6" component="h6" align="center" gutterBottom sx={{ color: 'black', marginBottom: 2}}>
              作成された問題がまだありません。問題を作成しましょう！！
            </Typography> 
            :
            questionlist.map((question) => (
              <>
                  <Card variant="outlined" className={styles.QuestionCard} key={question.questionSetId}>
                    <CardContent>
                      <Typography variant="h6" component="div">
                        {truncateString(question.questionSetTitle, 14)}
                      </Typography>
                      <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        {question.questionSetId}
                      </Typography>
                      <Typography variant="body2" sx={{height: "50px"}}>
                        {truncateString(question.description, 85)}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end' }}>
                      <Button size="small" onClick={() => handleOpenDetailModal(question.questionSetId, question.questionSetTitle)}>詳細</Button>
                    </CardActions>
                  </Card>
              </>
              )
            )
          }

        </Stack>
        <Modal
          open={openDetailModal}
          onClose={handleCloseDetailModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-descrxiption"
        >
          <Box sx={styleModal}>
            {linearProgressDeleteQuestion && <LinearProgress color="primary" />}
            <Typography variant="h5" component="div"sx={{mb:2, textAlign: 'right'}}>
              <CloseIcon onClick={handleCloseDetailModal}/>
            </Typography>
            <Typography variant="h5" component="div"sx={{mb:2, textAlign: 'center'}}>
              {Title}
            </Typography>
            {
                linearProgressDeleteQuestion ? 
                (
                  <div style={{textAlign: 'center'}}>
                    <Button onClick={() => {Router.push("/quiz/answer/"+Id)}} variant="contained" color="primary" startIcon={<CheckBoxIcon />} sx={{ mb: 2, mr:2, display: 'box' }} disabled>
                      回答
                    </Button>
                    <Button onClick={()=> {RequestDeleteQuestion(Id)}} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ mb: 2, mr:2, display: 'box' }} disabled>
                      削除
                    </Button>
                    <Button onClick={()=> {}} variant="contained" color="inherit" startIcon={<EditIcon />} sx={{ mb: 2, mr:2, display: 'box' }}  disabled>
                      編集
                    </Button>
                  </div>
                )
                :
                (
                  <div style={{textAlign: 'center'}}>
                    <Button onClick={() => {Router.push("/quiz/answer/"+Id)}} variant="contained" color="primary" startIcon={<CheckBoxIcon />} sx={{ mb: 2, mr:2, display: 'box' }}>
                      回答
                    </Button>
                    <Button onClick={()=> {RequestDeleteQuestion(Id)}} variant="contained" color="error" startIcon={<DeleteIcon />} sx={{ mb: 2, mr:2, display: 'box' }}>
                      削除
                    </Button>
                    <Button onClick={()=> {}} variant="contained" color="inherit" startIcon={<EditIcon />} sx={{ mb: 2, mr:2, display: 'box' }} >
                      編集
                    </Button>
                </div>
                )
              }
          </Box>
        </Modal>
      </div>  
      </>
    );
  }
}