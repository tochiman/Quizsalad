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

func DeleteQuestion(c *gin.Context) {
	var (
		token       string
		questionSet model.QuestionSet
		err         error
	)

	token = c.GetHeader("token")
	err = c.Bind(&questionSet)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": err.Error(),
		})
		return
	} else if questionSet.QuestionSetId == "" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": "Not Set QuestionSetId",
		})
		return
	}

	QuestionService := service.QuestionService{}
	err = QuestionService.DeleteQuestion(questionSet, token)
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

func AnswerQuestion(c *gin.Context) {
	var (
		questionSet       []model.QuestionSet
		questionSetAnswer []model.QuestionSetAnswer
		questions         []model.Questions
		err               error
		getQuestionId     string
	)

	getQuestionId = c.Query("questionId")
	getQuestionId = c.DefaultQuery("questionId", "None")
	if getQuestionId == "None" {
		c.JSON(http.StatusBadRequest, gin.H{
			"status":  "400 Bad Request",
			"content": "questionId is required",
		})
		return
	}

	questionService := service.QuestionService{}
	questionSet, questions, err = questionService.AnswerQuestion(getQuestionId)
	questionSetAnswer, err = service.BindQuestionSetAnswer(questionSet)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"status":  "500 Internal Server Error",
			"content": err.Error(),
		})
	} else {
		c.JSON(http.StatusOK, gin.H{
			"status":     "ok",
			"question":   questionSetAnswer,
			"questonSet": questions,
		})
	}
}
