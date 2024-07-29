
import React, { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Container,
  Box,
  Stepper,
  Step,
  StepLabel,
  Paper,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Alert,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Router from 'next/router'; // Next.jsのrouterをインポート
import Header from '@/component/Header'
import {useSession} from 'next-auth/react'
import Head from 'next/head';
import styles from "@/styles/Home.module.css";
import { useForm } from 'react-hook-form'

const CreateQuiz = () => {
  // NextAuth
  const {data: session, status: loading} = useSession()

  // プログレスバーの管理
  const [linearProgressDeleteQuestion, setLinearProgressDeleteQuestion] = React.useState(false)

  // クリップボードの処理
  const clickHandler = async () => {
    const message = questionId
    try {
      await navigator.clipboard.writeText(message)
      handleClickSnackCopyClip()
    } catch (error) {
      alert('失敗しました。')
    }
  }
  // クリップした時のSnackBarの処理
  const [openCopyClip, setOpenCopyClip] = React.useState(false);
  const handleClickSnackCopyClip = () => {
    setOpenCopyClip(true);
  };
  const handleCloseSnackCopyClip = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenCopyClip(false);
  };
  const actionSnackCopyClip = (
    <React.Fragment>
      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleCloseSnackCopyClip}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  // 入力内容を保存
  const [questionId, setQuestionId] = useState('');
  const [questionSetTitle, setQuestionSetTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questionSet, setQuestionSet] = useState([
    { questionTitle: '', 
      answerOptionA: '',
      answerOptionB: '',
      answerOptionC: '',
      answerOptionD: '',
      correctAnswer: ''
    },
  ]);
  
  const handleOptionChange1 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].answerOptionA = e.target.value;
    setQuestionSet(updatedQuestions);
  };
  const handleOptionChange2 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].answerOptionB = e.target.value;
    setQuestionSet(updatedQuestions);
  };
  const handleOptionChange3 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].answerOptionC = e.target.value;
    setQuestionSet(updatedQuestions);
  };
  const handleOptionChange4 = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].answerOptionD = e.target.value;
    setQuestionSet(updatedQuestions);
  };
  
  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].questionTitle = e.target.value;
    setQuestionSet(updatedQuestions);
  };
  
  const handleAnswerChange = (
    event: SelectChangeEvent<string>,
    questionIndex: number
  ) => {
    const updatedQuestions = [...questionSet];
    updatedQuestions[questionIndex].correctAnswer = event.target.value;
    setQuestionSet(updatedQuestions);
  };
  
  // ステップバー関連
  const [activeStep, setActiveStep] = useState(0);
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };
  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddQuestion = () => {
    setQuestionSet([
      ...questionSet,
      { questionTitle: '', 
        answerOptionA: '',
        answerOptionB: '',
        answerOptionC: '',
        answerOptionD: '',
        correctAnswer: ''
      },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questionSet.filter((_, qIndex) => qIndex !== index);
    setQuestionSet(updatedQuestions);
  };

  const [Alert400, setAlert400] = useState(false);
  const [Alert500, setAlert500] = useState(false);
  const [Alert200, setAlert200] = useState(false);

  const handleGoHome = () => {
    Router.push('/home'); // '/home'へのリダイレクトを実行
  };

  const steps = ['題名を入力', '問題カード作成', '結果'];

 //入力フォーム関連
 type FormData = {
    questionSetTitle: string,
    description: string,
    questionSet: typeof questionSet,
  };
  type TypeResult = {
    status: string,
    question_set_id: string,
  }

  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
    // バリデーションルールの定義
    criteriaMode: 'all',
  });
  
  const RegisterSubmit = handleSubmit(async (data: FormData) => {
    setLinearProgressDeleteQuestion(true)
    handleNext();handleNext()        //次のステップへ
    let token: string = session?.user.accessToken ?? ""
    const url = process.env.API_FRONT + '/api/v1/question/create'
    const Options = {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'token': token},
        body: JSON.stringify({
            questionSetTitle: questionSetTitle,
            description: description,
            questionSet: questionSet,
        }),
    }
    try{
      const result = await fetch(url, Options)
      const resultJson: TypeResult = await result.json()
      if (result.status === 400) setAlert400(true);
      else if (result.status === 500) setAlert500(true);
      else if (result.status === 200) {
        setAlert200(true);
        console.log(resultJson)
        setQuestionId(resultJson.question_set_id)
      }
    } finally {
      setLinearProgressDeleteQuestion(false)
    }
  });
  if (!session){
    return null
  } else {
    return (
      <>
        <Head>
          <title>quizsalad(問題作成)</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header site="createquiz" />
        <div className={styles.main}>
          <Container maxWidth="sm">
            <Box mt={4} mb={4}>
              <div>
                <h1 className={styles.auth_title}>Quizsalad</h1>
                <h3 className={styles.sub_title}>問題を作成</h3>
              </div>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((label) => (
                  <Step key={label}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
              <Paper elevation={3} style={{ padding: '16px', marginTop: '16px' }}>
                {activeStep === 0 && (
                  <Box>
                    <TextField
                      label="問題の題名"
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={questionSetTitle}
                      onChange={(e) => setQuestionSetTitle(e.target.value)}
                      required
                      />
                      <TextField
                        id="outlined-multiline-static"
                        fullWidth
                        label="問題の説明"
                        multiline
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                      />
                  </Box>
                )}
                <form onSubmit={RegisterSubmit}>
                {activeStep === 1 && (
                  <Box>
                    {questionSet.map((question, qIndex) => (
                      <Box key={qIndex} mb={4}>
                        <Typography variant="h6">問題 {qIndex + 1}</Typography>
                        <TextField
                          label="問題名"
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={question.questionTitle}
                          onChange={(e) => handleQuestionChange(e, qIndex)}
                          required
                          />
                        <Typography variant="body1" gutterBottom>
                          選択肢
                        </Typography>
                          <TextField
                          key={0}
                          label='選択肢1'
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={question.answerOptionA}
                          onChange={(e) => handleOptionChange1(e, qIndex)}
                          required
                          />
                          <TextField
                          key={1}
                          label='選択肢2'
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={question.answerOptionB}
                          onChange={(e) => handleOptionChange2(e, qIndex)}
                          required
                          />
                          <TextField
                          key={2}
                          label='選択肢3'
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={question.answerOptionC}
                          onChange={(e) => handleOptionChange3(e, qIndex)}
                          required
                          />
                          <TextField
                          key={3}
                          label='選択肢4'
                          fullWidth
                          margin="normal"
                          variant="outlined"
                          value={question.answerOptionD}
                          onChange={(e) => handleOptionChange4(e, qIndex)}
                          required
                          />
      
                        <FormControl fullWidth margin="normal">
                          <InputLabel id={`select-answer-label-${qIndex}`}>
                            正しい答え
                          </InputLabel>
                          <Select
                            labelId={`select-answer-label-${qIndex}`}
                            value={question.correctAnswer}
                            onChange={(e) => handleAnswerChange(e, qIndex)}
                            label="正しい答え"
                            MenuProps={{
                              MenuListProps: {
                                style: {
                                  maxHeight: 48 * 4.5,
                                  width: 'auto',
                                  height: '100%',
                                  display: 'flex',
                                  flexFlow: 'column',
                                },
                              },
                              anchorOrigin: {
                                vertical: 'bottom',
                                horizontal: 'left',
                              },
                              transformOrigin: {
                                vertical: 'top',
                                horizontal: 'left',
                              },
                            }}
                            >
                              <MenuItem key={0} value={question.answerOptionA}>
                                {question.answerOptionA}
                              </MenuItem>
                              <MenuItem key={1} value={question.answerOptionB}>
                                {question.answerOptionB}
                              </MenuItem>
                              <MenuItem key={2} value={question.answerOptionC}>
                                {question.answerOptionC}
                              </MenuItem>
                              <MenuItem key={3} value={question.answerOptionD}>
                                {question.answerOptionD}
                              </MenuItem>
                          </Select>
                        </FormControl>
      
                        {questionSet.length > 1 && (
                          <Box mt={2}>
                            <Button
                              variant="contained"
                              color="secondary"
                              onClick={() => handleRemoveQuestion(qIndex)}
                              startIcon={<DeleteIcon />}
                              >
                              問題カード削除
                            </Button>
                          </Box>
                        )}
                      </Box>
                    ))}
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={handleAddQuestion}
                        startIcon={<AddIcon />}
                        >
                        問題カード追加
                      </Button>
                    </Box>
                  </Box>
                )}
                {activeStep === 3 && (
                  <Box>
                    {linearProgressDeleteQuestion && <LinearProgress color="primary" />}
                    {Alert400 && <Alert severity="error" sx={{ width: '100%' }}>リクエストエラー</Alert>}
                    {Alert500 && <Alert severity="error" sx={{ width: '100%' }}>サーバーエラー</Alert>}
                    {Alert200 && <Alert severity="success" sx={{ width: '100%' }}>リクエスト成功</Alert>}
                    {Alert400 && <Typography sx={{ mt:2, mb: 1 }}>登録できない文字が含まれているかもしれません。もう一度登録し直してください。</Typography>}
                    {Alert500 && <Typography sx={{ mt:2, mb: 1 }}>サイト管理者に連絡してね〜👍</Typography>}
                    {Alert200 && 
                    <>
                      <Typography sx={{ mt:2, mb: 1 }}>問題を作成することができました。以下の問題IDを回答者に共有してください。</Typography>
                      <OutlinedInput
                        id="outlined-adornment-password"
                        type='text'
                        defaultValue={questionId}
                        fullWidth
                        margin="normal"
                        endAdornment={
                          <InputAdornment position="end">
                            <IconButton
                              aria-label="Copy clipboard"
                              onClick={clickHandler}
                              // onMouseDown={handleMouseDownPassword}
                              edge="end"
                            >
                              <ContentCopyIcon></ContentCopyIcon>
                            </IconButton>
                          </InputAdornment>
                        }
                      />
                      <Snackbar
                        open={openCopyClip}
                        autoHideDuration={4500}
                        onClose={handleCloseSnackCopyClip}
                        message="クリップボードにコピーしました"
                        action={actionSnackCopyClip}
                      />
                    </>
                    }
                  </Box>
                )}
                <Box mt={4} display="flex" justifyContent="space-between">
                  <Button type='button' disabled={activeStep === 0 || activeStep === 3} onClick={handleBack}>
                    戻る
                  </Button>
                  
                  <Button type='button' variant="outlined" color="error" onClick={handleGoHome}>
                    終了
                  </Button>
                  {activeStep === 3 && (
                    <Button type='button' variant="contained" color="primary" onClick={()=> {Router.reload()}}>
                      続けて作成
                    </Button>
                  )} 
                  {activeStep === 1 && (
                    <Button type='submit' variant="contained" color="primary">
                      作成
                    </Button>
                  )} 
                  {activeStep === 0 && (
                    <Button type='button' variant="contained" color="primary" onClick={handleNext}>
                      次へ
                    </Button>
                  )}
                </Box>
                </form>
              </Paper>
            </Box>
          </Container>
        </div>
      </>
    );
  }
};

export default CreateQuiz;