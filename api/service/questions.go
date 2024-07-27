package service

import (
	"api/model"

	sqlx "github.com/jmoiron/sqlx"
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

func (QuestionService) DeleteQuestion(questionSet model.QuestionSet, token string) error {
	db := connectDB()
	defer db.Close()

	_, err := db.Exec("DELETE FROM questionSet WHERE questionSetId=?  AND userId IN(SELECT id FROM token WHERE token=?)", questionSet.QuestionSetId, token)
	if err != nil {
		return err
	}
	return nil
}

func (QuestionService) AnswerQuestion(questionSetId string) ([]model.QuestionSet, []model.Questions, error) {
	// データベースの接続・切断処理
	db := connectDB()
	defer db.Close()

	var (
		err         error
		questionSet model.QuestionSet
		questions   model.Questions
		rows        *sqlx.Rows
	)

	// tokenよりユーザーを識別（ユーザーIDを取得する）
	rows, err = db.Queryx("SELECT * FROM questionSet WHERE questionSetId=?", questionSetId)
	if err != nil {
		return nil, nil, err
	}
	questionSetResult := make([]model.QuestionSet, 0)
	for rows.Next() {
		err := rows.StructScan(&questionSet)
		if err != nil {
			return nil, nil, err
		}

		questionSetResult = append(questionSetResult, questionSet)
	}

	rows, err = db.Queryx("SELECT * FROM questions WHERE questionSetId=?", questionSetId)
	if err != nil {
		return nil, nil, err
	}
	questionsResult := make([]model.Questions, 0)
	for rows.Next() {
		err := rows.StructScan(&questions)
		if err != nil {
			return nil, nil, err
		}
		questionsResult = append(questionsResult, questions)
	}
	return questionSetResult, questionsResult, err
}

func BindQuestionSetAnswer(questionSet []model.QuestionSet) ([]model.QuestionSetAnswer, error) {
	// データベースの接続・切断処理
	db := connectDB()
	defer db.Close()

	var username string

	err := db.Get(&username, "SELECT username FROM user WHERE userId=?", questionSet[0].UserId)
	if err != nil {
		return nil, err
	}

	resultQuestionSetAnswer := make([]model.QuestionSetAnswer, 1)
	resultQuestionSetAnswer[0].Username = username
	resultQuestionSetAnswer[0].QuestionSetTitle = questionSet[0].QuestionSetTitle
	resultQuestionSetAnswer[0].Description = questionSet[0].Description

	return resultQuestionSetAnswer, err
}
