package model

type Questions struct {
	QuestionTitle string `form:"questionTitle" db:"questionTitle" binding:"required" json:"questionTitle"`
	QuestionSetId string `form:"questionSetId" db:"questionSetId" binding:"required" json:"questionSetId"`
	QuestionNum   int16  `form:"questionNum" db:"questionNum" binding:"required" json:"questionNum"`
	EditOption    int16  `form:"editOption" db:"editOption" binding:"required" json:"editOption"`
	QuestionId    string `form:"questionId" db:"questionId" binding:"required" json:"questionId"`
	AnswerOptionA string `form:"answerOptionA" db:"answerOptionA" binding:"required" json:"answerOptionA"`
	AnswerOptionB string `form:"answerOptionB" db:"answerOptionB" binding:"required" json:"answerOptionB"`
	AnswerOptionC string `form:"answerOptionC" db:"answerOptionC" binding:"required" json:"answerOptionC"`
	AnswerOptionD string `form:"answerOptionD" db:"answerOptionD" binding:"required" json:"answerOptionD"`
	CorrectAnswer string `form:"correctAnswer" db:"correctAnswer" binding:"required" json:"correctAnswer"`
}
