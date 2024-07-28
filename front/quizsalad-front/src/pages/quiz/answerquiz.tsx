import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Alert,
} from '@mui/material';
import Router from 'next/router';
import Header from '@/component/Header';
import { useSession } from 'next-auth/react';
import Head from 'next/head';
import styles from "@/styles/Home.module.css";
import { useForm } from 'react-hook-form';

const AnswerQuiz = () => {
  const { data: session, status } = useSession();
  const [alertMessage, setAlertMessage] = useState('');
  const [questionSetId, setQuestionSetId] = useState('');
  const [questionsList, setQuestionsList] = useState([]);

  const [Alert400, setAlert400] = useState(false);
  const [Alert500, setAlert500] = useState(false);
  const [Alert200, setAlert200] = useState(false);

  type FormData = {
    questionId: string,
  };

  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
    criteriaMode: 'all',
  });

  const FetchAnswer = async (data: FormData) => {
    const url = `http://localhost:8080/api/v1/question/answer?questionId=${data.questionId}`;
    try {
      const result = await fetch(url, { method: 'GET', headers: { 'Content-Type': 'application/json' } });
      const resultJson = await result.json();
      if (resultJson.status === 'ok') {
        setAlert200(true);
        Router.push(`/quiz/answer/${data.questionId}`);
      } else {
        setAlertMessage('クイズセットが見つかりません。');
        setAlert400(true);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setAlert500(true);
    }
  };

  if (status === 'loading') {
    return <p>Loading.</p>;
  }

  if (!session) {
    return <p>Unauthorized</p>;
  }

  return (
    <>
      <Head>
        <title>Quiz Answer</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header site="answerquiz" />
      <div className={styles.main}>
        <Container maxWidth="sm">
          <Box mt={4} mb={4}>
            <div>
              <h1 className={styles.auth_title}>Quiz Answer</h1>
              <h3 className={styles.sub_title}>クイズに回答する</h3>
            </div>
            <form onSubmit={handleSubmit(FetchAnswer)}>
              <TextField
                label="問題セットIDを入力"
                fullWidth
                margin="normal"
                variant="outlined"
                {...register('questionId', { required: '問題セットIDは必須です。' })}
                error={!!errors.questionId}  // 修正点
                helperText={errors.questionId?.message}  // 修正点
              />
              {Alert400 && <Alert severity="error" sx={{ width: '100%' }}>リクエストエラー: {alertMessage}</Alert>}
              {Alert500 && <Alert severity="error" sx={{ width: '100%' }}>サーバーエラー</Alert>}
              {Alert200 && <Alert severity="success" sx={{ width: '100%' }}>リクエスト成功</Alert>}
              <Box mt={4} display="flex" justifyContent="space-between">
                <Button onClick={() => {Router.push("/home")}} variant="contained" color="error">
                  戻る
                </Button>
                <Button type='submit' variant="contained" color="primary">
                  回答ページへ
                </Button>
              </Box>
            </form>
          </Box>
        </Container>
      </div>
    </>
  );
};

export default AnswerQuiz;
