package controller

import (
	"api/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func GetHomeInformation(c *gin.Context) {
	token := c.GetHeader("token")
	if token == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": "TOken is required",
		})
		return
	}

	homeService := service.HomeService{}
	getData, err := homeService.GetHomeInformation(token)
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
