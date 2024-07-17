package model

type Questions struct {
	QuestionSetId string `form:"questionSetId" db:"questionSetId" json:"questionSetId"`
	QuestionId    string `form:"questionId" db:"questionId" json:"questionId"`
	QuestionTitle string `form:"questionTitle" db:"questionTitle" binding:"required" json:"questionTitle"`
	AnswerOptionA string `form:"answerOptionA" db:"answerOptionA" binding:"required" json:"answerOptionA"`
	AnswerOptionB string `form:"answerOptionB" db:"answerOptionB" binding:"required" json:"answerOptionB"`
	AnswerOptionC string `form:"answerOptionC" db:"answerOptionC" binding:"required" json:"answerOptionC"`
	AnswerOptionD string `form:"answerOptionD" db:"answerOptionD" binding:"required" json:"answerOptionD"`
	CorrectAnswer string `form:"correctAnswer" db:"correctAnswer" binding:"required" json:"correctAnswer"`
}
