package controllers

import (
	"logger/core"
	"logger/repositories"
	"net/http"

	"github.com/gin-gonic/gin"
)

type Controller struct {
	server       *core.Server
	repositories *repositories.Repositories
}

func NewController(s *core.Server, r *repositories.Repositories) *Controller {
	return &Controller{
		server:       s,
		repositories: r,
	}
}

func Ok(c *gin.Context, data any, message string) {
	c.JSON(http.StatusOK, gin.H{
		"message": message,
		"data":    &data,
	})
}

func Created(c *gin.Context, data any, message string) {
	c.JSON(http.StatusCreated, gin.H{
		"message": message,
		"data":    &data,
	})
}

func NoContent(c *gin.Context) {
	c.JSON(http.StatusNoContent, nil)
}

func BadRequest(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		"message": message,
	})
}

func Unauthorized(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
		"message": message,
	})
}

func Forbidden(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusForbidden, gin.H{
		"message": message,
	})
}

func NotFound(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusNotFound, gin.H{
		"message": message,
	})
}

func Error(c *gin.Context, message string) {
	c.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
		"message": message,
	})
}

func BadRequestWithData(c *gin.Context, data any, message string) {
	c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
		"message": message,
		"data":    &data,
	})
}
