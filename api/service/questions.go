package service

import (
	"api/model"
)

type QuestionService struct{}

func (QuestionService) CreateQuestion(questions model.QuestionSet, token string) (string, error) {
	// データベースの接続・切断処理
	db := connectDB()
	defer db.Close()

	var (
		err error
	)

	// Questionセットを管理するためのIDをランダム文字列10文字で生成
	questions.QuestionSetId, err = GenerateRandomString(10)
	if err != nil {
		return "", err
	}

	// tokenよりユーザーを識別（ユーザーIDを取得する）
	err = db.Get(&questions.UserId, "SELECT id FROM token WHERE token=?", token)
	if err != nil {
		return "", err
	}

	// 問題セットの親を作る
	_, err = db.Exec(`
		INSERT INTO questionSet (userId, questionSetId, questionSetTitle, description) VALUES (?, ?, ?, ?)`,
		questions.UserId, questions.QuestionSetId, questions.QuestionSetTitle, questions.Description)
	if err != nil {
		return "", err
	}

	// 問題を追加していく
	for _, item := range questions.QuestionSetList {
		item.QuestionId, err = GenerateRandomString(10)
		if err != nil {
			return "", err
		}
		_, err = db.Exec(`
		INSERT INTO questions (questionSetId, questionId, questionTitle, answerOptionA, answerOptionB, answerOptionC, answerOptionD, correctAnswer) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
			questions.QuestionSetId, item.QuestionId, item.QuestionTitle, item.AnswerOptionA, item.AnswerOptionB, item.AnswerOptionC, item.AnswerOptionD, item.CorrectAnswer,
		)
		if err != nil {
			return "", err
		}

	}
	return questions.QuestionSetId, err
}
