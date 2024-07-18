package model

type QuestionSet struct {
	UserId           string `form:"userId" db:"userId" binding:"required" json:"userId"`
	QuestionSetId    string `form:"questionSetId" db:"questionSetId" binding:"required" json:"questionSetId"`
	QuestionSetTitle string `form:"questionSetTitle" db:"questionSetTitle" binding:"required" json:"questionSetTitle"`
	Description      string `form:"description" db:"description" binding:"required" json:"description"`
}
