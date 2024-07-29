package service

import (
	"api/model"
	"log"
)

type UserService struct{}

func (UserService) GetUserInformation(username string) []model.User {
	db := connectDB()
	defer db.Close()
	rows, err := db.Queryx("SELECT * FROM user WHERE username=?", username)
	if err != nil {
		panic(err)
	}
	results := make([]model.User, 0)
	for rows.Next() {
		var user model.User

		err := rows.StructScan(&user)
		if err != nil {
			log.Fatal(err)
		}
		results = append(results, user)
	}
	return results
}

func (UserService) AddUserInformation(user *model.User) error {
	db := connectDB()
	defer db.Close()

	user.Id = Generate_uuid()
	_, err := db.NamedExec(
		"INSERT INTO user (userId, username, passPhrase) VALUES(:userId, :username, :passPhrase) ",
		user,
	)
	if err != nil {
		return err
	}
	return nil
}

func (UserService) DeleteUserInformation(token string) error {
	db := connectDB()
	defer db.Close()

	_, err := db.Exec("DELETE FROM user WHERE userId IN(SELECT id FROM token WHERE token=?)", token)
	if err != nil {
		return err
	}
	return nil
}

func (UserService) UpdateUserInformation(user *model.User, token string) error {
	db := connectDB()
	defer db.Close()

	var uuid string
	err := db.Get(&uuid, "SELECT id FROM token WHERE token=?", token)
	if err != nil {
		return err
	} else {
		if uuid != "" {
			user.Id = uuid
			_, err = db.NamedExec(
				"UPDATE user SET username = :username, passPhrase = :passPhrase WHERE userId= :userId", user,
			)
			if err != nil {
				return err
			}
		} else {
			return err
		}
	}

	return nil
}
