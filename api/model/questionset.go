package model

type QuestionSet struct {
	UserId           string      `form:"userId" db:"userId" json:"userId"`
	QuestionSetId    string      `form:"questionSetId" db:"questionSetId" json:"questionSetId"`
	QuestionSetTitle string      `form:"questionSetTitle" db:"questionSetTitle" binding:"required" json:"questionSetTitle"`
	QuestionSetList  []Questions `form:"questionSet" json:"questionSet"`
	Description      string      `form:"description" db:"description" json:"description"`
}

// Homeエンドポイントにて返却時に必要な情報に絞った型
type QuestionSetHome struct {
	QuestionSetId    string `form:"questionSetId" db:"questionSetId" json:"questionSetId"`
	QuestionSetTitle string `form:"questionSetTitle" db:"questionSetTitle" binding:"required" json:"questionSetTitle"`
	Description      string `form:"description" db:"description" binding:"required" json:"description"`
}

type QuestionSetAnswer struct {
	Username         string `form:"username" json:"username"`
	QuestionSetTitle string `form:"questionSetTitle" db:"questionSetTitle" binding:"required" json:"questionSetTitle"`
	Description      string `form:"description" db:"description" binding:"required" json:"description"`
}
