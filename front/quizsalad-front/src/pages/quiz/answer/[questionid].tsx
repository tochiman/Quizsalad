import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Snackbar from '@mui/material/Snackbar';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useSession } from 'next-auth/react';
import { Router, useRouter } from 'next/router'; // 追加
import Header from '@/component/Header';
import styles from "@/styles/Home.module.css";

const QuizPage = () => {
  const router = useRouter();
  const questionId  = router.query.questionid;
  const { data: session, status } = useSession();

  const [currentQuiz, setCurrentQuiz] = useState<TypeResult>(
    {
      question: [],
      questionSet: [],
      status: "",
    }
  );
  
  //進行中の問題番号を管理
  const [questionNumber, setQuestionNumber] = useState<number>(0)
  //　　結果を表示を管理
  const [resultAlert, setResultAlert] = useState(false)
  const [resultQuestion, setResultQuestion] = useState("")
  const [resultColor, setResultColor] = useState<'success' | 'error'>("success")
  const [disableButton, setDisableButton] = useState<boolean>(false)  
  // 次の問題へ行くを表示・非表示
  const [nextQuestion, setNextQuestion] = useState(false)
  // 問題が終了したことを管理
  const [finishQuestion, setFinishQuestion] = useState(false)

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Snackbar の状態管理
  const [openSnackBar, setOpenSnackBar] = useState(false);
  const [snackBarMessage, setSnackBarMessage] = useState('');
  const [severity, setSeverity] = useState<'success' | 'error'>('success');

  const handleClickSnackBar = (message: string, severity: 'success' | 'error') => {
    setSnackBarMessage(message);
    setSeverity(severity);
    setOpenSnackBar(true);
  };

  const handleCloseSnackBar = () => {
    setOpenSnackBar(false);
  };

  interface TypeQuesntion {
    username: string;
    questionSetTitle: string;
    description: string;
  }
  interface TypeQuestionSet {
    "questionSetId": string,
    "questionId": string,
    "questionTitle": string,
    "answerOptionA": string,
    "answerOptionB": string,
    "answerOptionC": string,
    "answerOptionD": string,
    "correctAnswer": string,
  }
  type TypeResult = {
    question: TypeQuesntion[],
    questionSet: TypeQuestionSet[],
    status: string,
  }


  useEffect(() => {
    const fetchQuizData = async () => {
      const url = process.env.API_FRONT + "/api/v1/question/answer?questionId=" + questionId ;
      try {
        const Options = {
          method: 'GET',
          headers: { 'Content-Type': 'application/json'},
        }
        const result = await fetch(url, Options);
        const resultJson: TypeResult = await result.json();
        console.log('Fetched data:', resultJson);

        if (resultJson.status === 'ok') {
          const quiz = resultJson
          if (quiz) {
            setCurrentQuiz(quiz);
            handleClickSnackBar('クイズ情報を取得しました。', 'success');
          } else {
            setError('該当するクイズが見つかりません。');
            handleClickSnackBar('該当するクイズが見つかりません。', 'error');
          }
        } else {
          setError('クイズ情報の取得に失敗しました。');
          handleClickSnackBar('クイズ情報の取得に失敗しました。', 'error');
        }
      } catch (error) {
        setError('エラーが発生しました。一度ホームに戻ってください。');
        handleClickSnackBar('エラーが発生しました。一度ホームに戻ってください。', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [questionId]);

  const handleAnswer = (selectedOption: string) => {
    try {
      if (selectedOption === currentQuiz.questionSet[questionNumber].correctAnswer) {
        setDisableButton(true)
        setResultQuestion("正解です！")
        setResultColor("success")
        setResultAlert(true)
      } else {
        setDisableButton(true)
        setResultQuestion(`不正解です。正解は ${currentQuiz.questionSet[questionNumber].correctAnswer} です。`);
        setResultColor("error")
        setResultAlert(true)
      }
    } finally {
      if (currentQuiz.questionSet.length - 1 === questionNumber){
        setFinishQuestion(true)
      } else {
        setNextQuestion(true)
      }
    }
  };

  if (loading) {
    return (
      <CircularProgress color="primary" sx={{position: 'absolute' ,top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}/>
    );
  }

  if (error) {
    return (
      <>
        <Head>
          <title>quizsalad(問題回答)</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header site="answer" />
        <Container>
          <Typography variant="h5" color="error" sx={{position: 'absolute' ,top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
            {error}
          </Typography>
        </Container>
      </>
    );
  }

  if (!currentQuiz) {
    return (
      <>
        <Container>
          <Head>
            <title>quizsalad(問題回答)</title>
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
          </Head>
          <Header site="answer" />
          <Typography variant="h5" color="error" sx={{position: 'absolute' ,top: '50%', left: '50%', transform: 'translate(-50%, -50%)', }}>
            No quiz found.
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Head>
        <title>quizsalad(問題回答)</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header site="answer" />

      <div className={styles.Main}>
        <Container>
          <Paper elevation={12} sx={{position: 'absolute', transform: 'translate(-50%, -50%)',top: '50%',left: '50%', width: '80%', p: '15px'}}>
          <Typography variant="h6" sx={{textAlign: 'center'}}>{currentQuiz.question[0].questionSetTitle}</Typography>
          <Box mt={4}>
            <Typography variant="h6" sx={{mb:2, textAlign: 'left'}}>問題名</Typography>
            <Typography sx={{mb:2, textAlign: 'left'}}>{currentQuiz.questionSet[questionNumber].questionTitle}</Typography>
            <Typography variant="h6" sx={{mb:2, textAlign: 'left'}}>選択肢</Typography>
            { resultAlert && <Alert severity={resultColor} sx={{width: '100%', mb:2}}>{resultQuestion}</Alert> }
            <Box sx={{ml:2, mr: 2, textAlign: 'center'}}>
              {
                disableButton ? 
                (
                  <>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionA)}} variant="outlined" sx={{mb: 2, width: '90%'}} disabled>
                      A: {currentQuiz.questionSet[questionNumber].answerOptionA}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionB)}} variant="outlined" sx={{mb: 2, width: '90%'}} disabled>
                      B: {currentQuiz.questionSet[questionNumber].answerOptionB}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionC)}} variant="outlined" sx={{mb: 2, width: '90%'}} disabled>
                      C: {currentQuiz.questionSet[questionNumber].answerOptionC}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionD)}} variant="outlined" sx={{mb: 2, width: '90%'}} disabled>
                      D: {currentQuiz.questionSet[questionNumber].answerOptionD}
                    </Button>
                  </>
                )
                :
                (
                  <>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionA)}} variant="outlined" sx={{mb: 2, width: '90%'}}>
                      A: {currentQuiz.questionSet[questionNumber].answerOptionA}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionB)}} variant="outlined" sx={{mb: 2, width: '90%'}}>
                      B: {currentQuiz.questionSet[questionNumber].answerOptionB}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionC)}} variant="outlined" sx={{mb: 2, width: '90%'}}>
                      C: {currentQuiz.questionSet[questionNumber].answerOptionC}
                    </Button>
                    <Button onClick={() => {handleAnswer(currentQuiz.questionSet[questionNumber].answerOptionD)}} variant="outlined" sx={{mb: 2, width: '90%'}}>
                      D: {currentQuiz.questionSet[questionNumber].answerOptionD}
                    </Button>
                  </>
                )
              }
            </Box>
          </Box>
          {nextQuestion && 
            <div style={{textAlign: 'right'}}>
              <Button variant="contained" onClick={() => {setQuestionNumber(questionNumber + 1); setNextQuestion(false); setResultAlert(false); setDisableButton(false)}}>続行する</Button>
            </div>
          }
          {finishQuestion && 
            <div style={{textAlign: 'right'}}>
              <Button variant="contained" color='error' onClick={() => {setFinishQuestion(false);setResultAlert(false); router.push('/home')}}>終了する</Button>
            </div>
          }
          </Paper>
        </Container>
        <Snackbar open={openSnackBar} autoHideDuration={2500} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
            {snackBarMessage}
          </Alert>
        </Snackbar>

      </div>
      
    </>
  );
};

export default QuizPage;
