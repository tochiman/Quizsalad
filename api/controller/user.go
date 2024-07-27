package controller

import (
	"api/model"
	"api/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetUserInformation(c *gin.Context) {
	getUser := c.Query("username")
	getUser = c.DefaultQuery("username", "None")
	if getUser == "None" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": "Username is required",
		})
		return
	}

	userService := service.UserService{}
	getData := userService.GetUserInformation(getUser)
	if len(getData) == 0 {
		c.JSON(http.StatusNotFound, gin.H{
			"status": "none",
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status": "ok",
			"result": getData,
		})
	}
}

func AddUserInformation(c *gin.Context) {
	var userModel model.User

	err := c.Bind(&userModel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": err.Error(),
		})
		return
	}
	userService := service.UserService{}
	err = userService.AddUserInformation(&userModel)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
	} else {
		c.JSON(http.StatusCreated, gin.H{
			"status": "ok",
			"data":   userModel,
		})
	}
}

func DeleteUserInformation(c *gin.Context) {
	token := c.GetHeader("token")

	UserService := service.UserService{}
	err := UserService.DeleteUserInformation(token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
		return
	}
	c.JSON(http.StatusOK, gin.H{
		"status": "ok",
	})
}

func UpdateUserInformation(c *gin.Context) {
	var userModel model.User
	err := c.Bind(&userModel)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": err.Error(),
		})
		return
	}
	token := c.GetHeader("token")

	UserService := service.UserService{}
	err = UserService.UpdateUserInformation(&userModel, token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
		return
	}
	c.JSON(http.StatusNoContent, gin.H{
		"status": "ok",
	})
}
