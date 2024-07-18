// pages/quiz/[id].js

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import quizzesData from '../quiz/data'; // クイズデータをインポート

const QuizPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const quizzes = quizzesData.find(q => q.id === parseInt(id));

  if (!quizzes) {
    return <p>Loading...</p>;
  }

  const currentQuiz = quizzes.quizzes[currentQuizIndex];

  const handleAnswer = (selectedOption) => {
    if (selectedOption === currentQuiz.answer) {
      alert('正解です！');
    } else {
      alert('不正解です。正解は ' + currentQuiz.answer + ' です。');
    }

    // 次のクイズに進む
    if (currentQuizIndex < quizzes.quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
    } else {
      alert('クイズが終了しました。次のページに移動します。');
      // 次のページにリダイレクトするなどの処理を実装する
      router.push('answerquiz');
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>{currentQuiz.question}</h2>
      <ul>
        {currentQuiz.options.map((option, index) => (
          <li key={index}>
            <button onClick={() => handleAnswer(option)}>{option}</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuizPage;
