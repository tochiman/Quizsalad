import React, { useState } from 'react';

const QuizForm = ({ onSubmit }) => {
  const [subject, setSubject] = useState('');
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '', '', '']);
  const [answer, setAnswer] = useState('');

  const handleOptionChange = (e, index) => {
    const updatedOptions = [...options];
    updatedOptions[index] = e.target.value;
    setOptions(updatedOptions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newQuizItem = {
      subject,
      question,
      options,
      answer,
    };
    onSubmit(newQuizItem);
    setSubject('');
    setQuestion('');
    setOptions(['', '', '', '']);
    setAnswer('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Subject:</label>
      <input type="text" value={subject} onChange={(e) => setSubject(e.target.value)} required />
      <br />
      <label>Question:</label>
      <input type="text" value={question} onChange={(e) => setQuestion(e.target.value)} required />
      <br />
      <label>Options:</label>
      {options.map((opt, index) => (
        <div key={index}>
          <input type="text" value={opt} onChange={(e) => handleOptionChange(e, index)} required />
        </div>
      ))}
      <label>Correct Answer:</label>
      <input type="text" value={answer} onChange={(e) => setAnswer(e.target.value)} required />
      <br />
      <button type="submit">Add Quiz Item</button>
    </form>
  );
};

export default QuizForm;
