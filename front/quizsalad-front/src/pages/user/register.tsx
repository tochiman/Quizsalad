import Head from 'next/head'
import Router from 'next/router';
import styles from '@/styles/Home.module.css'
import { useState, SyntheticEvent, ReactNode, Fragment } from 'react'
import { useSession } from 'next-auth/react'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { useForm } from 'react-hook-form'
import {
  Button,
  TextField,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Alert,
  IconButton,
  OutlinedInput,
  InputLabel,
  InputAdornment,
  FormControl,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow,
  Paper,
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

export default function Home() {

  //セッション管理
  const {data: session} = useSession()

  //コンポーネントの状態管理
  const [AlertOn, AlertStatus] = useState(false)
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [formValue, setFormValue] = useState({
      username : "",
      password : "",
      password_confirm : "",
  });
  const [Alert400, setAlert400] = useState(false);
  const [Alert500, setAlert500] = useState(false);
  const [Alert201, setAlert201] = useState(false);

  //パスワードの表示・非表示
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordConfirm = () => setShowPasswordConfirm((show) => !show);


  //ステップバー関連
  const steps = ['入力', '確認', '結果'];
  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  //入力フォーム関連
  type FormData = {
    name: string,
    password: string,
    password_confirm: string; 
  };
  const schema = yup.object().shape({
    password: yup
      .string()
      .required('入力必須')
      .min(6, 'パスワードは6文字以上である必要があります')
      .matches(/^[a-zA-Z0-9_-]+$/, 'パスワードはアルファベット、数字、ハイフン、アンダースコアしか使えません'),
  });
  const { register, setValue, handleSubmit, formState: { errors } } = useForm<FormData>({
      // バリデーションルールの定義
      criteriaMode: 'all',
      defaultValues: {
        password: '',
      },
      resolver: yupResolver(schema),
  });
  const onSubmit = handleSubmit((data: FormData) => {
    if (data.password === data.password_confirm){
      handleNext()        //次のステップへ
      setFormValue(data)
      AlertStatus(false)  //パスワードが一致しているため非表示
    } else if (data.password !== data.password_confirm) AlertStatus(true)   //パスワードが不一致のため表示

  });
  const RegisterSubmit =  handleSubmit((data: FormData) => {
    handleNext();handleNext();        //次のステップへ
    const url = process.env.API_FRONT + '/api/v1/user/create';

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: data.name,
        passPhrase: data.password,
      }),
    };
    fetch(url, requestOptions).then((response) => {
      if (response.status === 400) setAlert400(true);
      else if (response.status === 500) setAlert500(true);
      else if (response.status === 201) setAlert201(true);
    })
  });

  // 文字数に応じて「*」を増やして返却
  function addStars(text: string): string {
    const length = text.length;
    let stars = '';
  
    // 文字数に応じて*を追加
    for (let i = 0; i < length; i++) {
      stars += '*';
    }
    return `${stars}`;
  }
  
  if(session){
    Router.push('/home');
  }else{
    return( 
      <div className={styles.container}>
        <Head>
          <title>quizsalad</title>
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <div className={styles.main}>
          <div>
            <h1 className={styles.auth_title}>Quizsalad</h1>
            <h3 className={styles.sub_title}>ユーザー新規作成</h3>
          </div>
          <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {};
                const labelProps: {
                  optional?: ReactNode;
                } = {};
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel {...labelProps}>{label}</StepLabel>
                  </Step>
                );
              })}
            </Stepper>
            {activeStep === steps.length ? (
              <Fragment>
                <div className={styles.new_border}>
                  <Typography sx={{ mt: 2, mb: 1 }}>
                    {Alert400 && <Alert severity="error" sx={{ width: '100%' }}>リクエストエラー</Alert>}
                    {Alert500 && <Alert severity="error" sx={{ width: '100%' }}>サーバーエラー</Alert>}
                    {Alert201 && <Alert severity="success" sx={{ width: '100%' }}>登録が完了しました。</Alert>}
                  {Alert400 && <Typography sx={{ mt:2, mb: 1, color: 'black' }}>登録できない文字が含まれている。もしくは、すでに登録済みの可能性があります。もう一度登録し直してください。</Typography>}
                  {Alert500 && <Typography sx={{ mt:2, mb: 1, color: 'black' }}>すでに登録されたメールアドレスか、使用できない文字が含まれています。</Typography>}
                  {Alert201 && <Typography sx={{ mt:2, mb: 1, color: 'black' }}>アカウントが作成されました。</Typography>}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                    <Box sx={{ flex: '1 1 auto' }} />
                    {Alert400 && <Button variant='outlined' onClick={() => {Router.push('/user/register')}}>ユーザー登録画面へ</Button>}
                    {Alert500 && <Button variant='outlined' onClick={() => {Router.push('/user/register')}}>ユーザー登録画面へ</Button>}
                    {Alert201 && <Button variant='contained' onClick={() => {Router.push('/api/auth/signin')}}>ログインへ</Button>}
                  </Box>
                </div>
              </Fragment>
            ) : (
              <Fragment>
                  <div className={styles.new_border}>
                    {activeStep === 0 ? (
                      <form onSubmit={onSubmit}>
                        {errors.password && <Alert severity='error' sx={{mb:"10px"}} >{errors.password.message}</Alert>}
                        {AlertOn === false ? null: <Alert severity='error'>パスワードが一致していません。再度入力してください。</Alert>}
                        <TextField id="outlined-basic" label="ユーザー名" variant="outlined" margin='normal' sx={{ width:"100%" }} {...register('name',{required:true})} required />
                        <div>
                          <FormControl sx={{ mb: '0px', width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">パスワード</InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-password"
                              type={showPassword ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="パスワード"
                              {...register('password',{required:true})} 
                            />
                          </FormControl>
                          <p className={styles.helperText}>アルファベット、数字、ハイフン、アンダースコアのみ使用可能</p>
                        </div>
                        <div>
                          <FormControl sx={{ width: '100%' }} variant="outlined">
                            <InputLabel htmlFor="outlined-adornment-password">パスワード確認</InputLabel>
                            <OutlinedInput
                              id="outlined-adornment-password"
                              type={showPasswordConfirm ? 'text' : 'password'}
                              endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordConfirm}
                                    edge="end"
                                  >
                                    {showPasswordConfirm ? <VisibilityOff /> : <Visibility />}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="パスワード確認"
                              {...register('password_confirm',{required:true})} 
                            />
                          </FormControl>
                          <p className={styles.helperText}>確認のためにもう一度入力してください</p>
                        </div>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button color="inherit" onClick={() => {Router.push('/')}} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                            <Button type="submit" variant='contained' sx={{ mr: 1, width: "50%" }}>
                              {activeStep === steps.length - 1 ? '作成' : '次へ'}
                            </Button>
                        </Box>
                    </form>
                    ):null}
                    {activeStep === 1 ? (
                      <form onSubmit={RegisterSubmit}> 
                        <Typography variant="h6" gutterBottom>
                          以下の情報でアカウントを作成しますか？
                        </Typography>
                        <TableContainer component={Paper}>
                          <Table>
                          <caption>パスワードは安全のため伏せています</caption>
                            <TableBody>
                              <TableRow>
                                <TableCell>名前</TableCell>
                                <TableCell>{formValue.username}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell>パスワード</TableCell>
                                <TableCell>{addStars(formValue.password)}</TableCell>
                              </TableRow>
                            </TableBody>
                          </Table>
                        </TableContainer>
                        <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                          <Button color="inherit" onClick={handleBack} sx={{ mr: 1, width: "50%" }} variant='outlined' >戻る</Button>
                          <Box sx={{ flex: '1 1 auto' }} />
                            <Button type="submit" variant='contained' sx={{ mr: 1, width: "50%" }}>
                              {activeStep === steps.length - 1 ? '作成' : '次へ'}
                            </Button>
                        </Box>
                      </form>
                    ): null}
                </div>
              </Fragment>
            )}
          </Box>
        </div>
      </div>
  )
  }
}