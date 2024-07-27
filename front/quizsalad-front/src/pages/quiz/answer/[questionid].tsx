import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // 追加
import Header from '@/component/Header';

const QuizPage = () => {
  const router = useRouter();
  const { questionId } = router.query;
  const { data: session, status } = useSession();

  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [error, setError] = useState(null);
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

  useEffect(() => {
    const fetchQuizData = async () => {
      if (questionId && session) {
        const url = `http://localhost:8080/api/v1/question/answer?questionId=${questionId}`;
        const token = session.user.accessToken ?? '';

        try {
          const result = await fetch(url, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json', 'token': token },
          });
          const resultJson = await result.json();
          console.log('Fetched data:', resultJson);

          if (resultJson.status === 'ok') {
            const quiz = resultJson.questionSet.find(q => q.questionId === questionId);
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
          console.error('Error fetching quiz data:', error);
          setError('サーバーエラーが発生しました。');
          handleClickSnackBar('サーバーエラーが発生しました。', 'error');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchQuizData();
  }, [questionId, session]);

  const handleAnswer = (selectedOption) => {
    if (currentQuiz && selectedOption === currentQuiz.correctAnswer) {
      alert('正解です！');
    } else if (currentQuiz) {
      alert(`不正解です。正解は ${currentQuiz.correctAnswer} です。`);
    }

    router.push('/answerquiz');
  };

  if (loading) {
    return (
      <Container>
        <Typography variant="h5">Loading...</Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography variant="h5" color="error">
          {error}
        </Typography>
      </Container>
    );
  }

  if (!currentQuiz) {
    return (
      <Container>
        <Typography variant="h5">No quiz found.</Typography>
      </Container>
    );
  }

  return (
    <>
      <Head>
        <title>Quiz Page</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header site="quiz" />
      <Container>
        <Box mt={4}>
          <Typography variant="h5">{currentQuiz.questionTitle}</Typography>
          <Box mt={2}>
            <Typography variant="body1">A. {currentQuiz.answerOptionA}</Typography>
            <Typography variant="body1">B. {currentQuiz.answerOptionB}</Typography>
            <Typography variant="body1">C. {currentQuiz.answerOptionC}</Typography>
            <Typography variant="body1">D. {currentQuiz.answerOptionD}</Typography>
          </Box>
          <Box mt={4}>
            <Button variant="contained" color="primary" onClick={() => handleAnswer('A')}>
              A
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleAnswer('B')}>
              B
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleAnswer('C')}>
              C
            </Button>
            <Button variant="contained" color="primary" onClick={() => handleAnswer('D')}>
              D
            </Button>
          </Box>
        </Box>
      </Container>
      <Snackbar open={openSnackBar} autoHideDuration={6000} onClose={handleCloseSnackBar}>
        <Alert onClose={handleCloseSnackBar} severity={severity} sx={{ width: '100%' }}>
          {snackBarMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default QuizPage;
