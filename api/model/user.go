package model

type User struct {
	Id       string `form:"userId" db:"userId" json:"userId"`
	Username string `form:"userName" db:"userName" binding:"required" json:"userName"`
	Password string `form:"passPhrase" db:"passPhrase" json:"passPhrase"`
}
