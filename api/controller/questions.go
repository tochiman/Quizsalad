package controller

import (
	"api/model"
	"api/service"
	"net/http"

	"github.com/gin-gonic/gin"
)

func CreateQuestion(c *gin.Context) {
	var (
		token         string
		questionSet   model.QuestionSet
		err           error
		questionSetId string
	)

	token = c.GetHeader("token")
	err = c.Bind(&questionSet)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": err.Error(),
		})
		return
	}

	questionService := service.QuestionService{}
	questionSetId, err = questionService.CreateQuestion(questionSet, token)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status":          "ok",
			"question_set_id": questionSetId,
		})
	}
}
