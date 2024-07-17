package service

import (
	"api/model"
)

type HomeService struct{}

func (HomeService) GetHomeInformation(username string) ([]model.QuestionSetHome, error) {
	db := connectDB()
	defer db.Close()

	var userId string
	var questionSet []model.QuestionSetHome

	err := db.Get(&userId, "SELECT userId FROM user WHERE username = ?", username)
	if err != nil {
		return questionSet, err
	}
	err = db.Select(&questionSet, "SELECT questionSetId, questionSetTitle, description FROM questionSet WHERE userId=?", userId)
	if err != nil {
		return questionSet, err
	}
	return questionSet, err
}
