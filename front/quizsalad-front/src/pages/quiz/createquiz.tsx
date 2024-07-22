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
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { useRouter } from 'next/router'; // Next.jsのrouterをインポート

const CreateQuiz = () => {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const [subject, setSubject] = useState('');
  const [questions, setQuestions] = useState([
    { question: '', options: ['', '', '', ''], answer: '' },
  ]);

  const handleOptionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number,
    optionIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].options[optionIndex] = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleQuestionChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    questionIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].question = e.target.value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (
    event: SelectChangeEvent<string>,
    questionIndex: number
  ) => {
    const updatedQuestions = [...questions];
    updatedQuestions[questionIndex].answer = event.target.value;
    setQuestions(updatedQuestions);
  };

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleAddQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', options: ['', '', '', ''], answer: '' },
    ]);
  };

  const handleRemoveQuestion = (index: number) => {
    const updatedQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newQuizItem = {
      subject,
      questions,
    };

    try {
      const response = await fetch('/api/addQuiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuizItem),
      });
      const data = await response.json();
      console.log(data); // 成功した場合のレスポンスを表示

      // 成功したら、フォームをリセットする
      setSubject('');
      setQuestions([{ question: '', options: ['', '', '', ''], answer: '' }]);
      setActiveStep(0);
    } catch (error) {
      console.error('Error adding quiz item:', error);
    }
  };

  const handleGoHome = () => {
    router.push('../home'); // '/home'へのリダイレクトを実行
  };

  const steps = ['Enter Subject', 'Enter Questions'];

  return (
    <Container maxWidth="sm">
      <Box mt={4} mb={4}>
        <Typography variant="h4" align="center" gutterBottom>
          Add Quiz Item
        </Typography>
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
                label="Subject"
                fullWidth
                margin="normal"
                variant="outlined"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
              />
            </Box>
          )}
          {activeStep === 1 && (
            <Box>
              {questions.map((question, qIndex) => (
                <Box key={qIndex} mb={4}>
                  <Typography variant="h6">Question {qIndex + 1}</Typography>
                  <TextField
                    label="Question"
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    value={question.question}
                    onChange={(e) => handleQuestionChange(e, qIndex)}
                    required
                  />
                  <Typography variant="body1" gutterBottom>
                    Options
                  </Typography>
                  {question.options.map((opt, oIndex) => (
                    <TextField
                      key={oIndex}
                      label={`Option ${oIndex + 1}`}
                      fullWidth
                      margin="normal"
                      variant="outlined"
                      value={opt}
                      onChange={(e) => handleOptionChange(e, qIndex, oIndex)}
                      required
                    />
                  ))}

                  <FormControl fullWidth margin="normal">
                    <InputLabel id={`select-answer-label-${qIndex}`}>
                      Correct Answer
                    </InputLabel>
                    <Select
                      labelId={`select-answer-label-${qIndex}`}
                      value={question.answer}
                      onChange={(e) => handleAnswerChange(e, qIndex)}
                      label="Correct Answer"
                    >
                      {question.options.map((option, oIndex) => (
                        <MenuItem key={oIndex} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  {questions.length > 1 && (
                    <Box mt={2}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleRemoveQuestion(qIndex)}
                        startIcon={<DeleteIcon />}
                      >
                        Remove Question
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
                  Add Question
                </Button>
              </Box>
            </Box>
          )}
          <Box mt={4} display="flex" justifyContent="space-between">
            <Button disabled={activeStep === 0} onClick={handleBack}>
              Back
            </Button>
            <Button onClick={handleGoHome}>
              End
            </Button>
            {activeStep === steps.length - 1 ? (
              <Button variant="contained" color="primary" onClick={handleSubmit}>
                Submit
              </Button>
            ) : (
              <Button variant="contained" color="primary" onClick={handleNext}>
                Next
              </Button>
            )}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default CreateQuiz;
