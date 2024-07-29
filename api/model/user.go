package model

type User struct {
	Id       string `form:"userId" db:"userId" json:"userId"`
	Username string `form:"username" db:"username" binding:"required" json:"username"`
	Password string `form:"passPhrase" db:"passPhrase" json:"passPhrase"`
}
