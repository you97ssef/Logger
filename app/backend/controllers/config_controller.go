package controllers

import (
	"time"

	"github.com/gin-gonic/gin"
)

func (ctl *Controller) Test(c *gin.Context) {
	ctl.server.Logger.Info("Test endpoint hit")
	Ok(c, "Test works at "+time.Now().Local().Format("2006-01-02 15:04:05"), "Test Successful")
}
