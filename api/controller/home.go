package controller

import (
	"api/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHomeInformation(c *gin.Context) {
	getUser := c.Query("username")
	getUser = c.DefaultQuery("username", "None")
	if getUser == "None" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": "Username is required",
		})
		return
	}

	homeService := service.HomeService{}
	getData, err := homeService.GetHomeInformation(getUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status":        "ok",
			"questionsList": getData,
		})
	}
}
