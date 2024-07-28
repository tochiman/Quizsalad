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
import { useRouter } from 'next/router'; // 追加
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
  const [questionlist, setquestionlist] = useState<TypeQuesntion[]>([])
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
        setError('サーバーエラーが発生しました。');
        handleClickSnackBar('サーバーエラーが発生しました。', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizData();
  }, [questionId]);

  const handleAnswer = (selectedOption) => {
    if (currentQuiz && selectedOption === currentQuiz.questionSet[0].correctAnswer) {
      alert('正解です！');
    } else if (currentQuiz) {
      alert(`不正解です。正解は ${currentQuiz.questionSet[0].correctAnswer} です。`);
    }

    router.push('/answerquiz');
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
            <Typography variant="h6">{currentQuiz.questionSet[0].questionTitle}</Typography>
            <Typography variant="h6">{currentQuiz.questionSet[0].questionTitle}</Typography>
            <Box sx={{mt: 4, ml:2, mr: 2, textAlign: 'center'}}>
              <Button variant="outlined" sx={{mb: 3, width: '90%'}}>
                A: {currentQuiz.questionSet[0].answerOptionA}
              </Button>
              <Button variant="outlined" sx={{mb: 3, width: '90%'}}>
                B: {currentQuiz.questionSet[0].answerOptionB}
              </Button>
              <Button variant="outlined" sx={{mb: 3, width: '90%'}}>
                C: {currentQuiz.questionSet[0].answerOptionC}
              </Button>
              <Button variant="outlined" sx={{mb: 3, width: '90%'}}>
                D: {currentQuiz.questionSet[0].answerOptionD}
              </Button>
              </Box>
              </Box>
          </Paper>
        </Container>
        <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
          <Alert onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
            {snackBarMessage}
          </Alert>
        </Snackbar>

      </div>
      
    </>
  );
};

export default QuizPage;
