package controllers

import (
	"github.com/gin-gonic/gin"
)

// TailLogs upgrades to a WebSocket and subscribes the client to real-time
// log entries for the provided profile token. The token is validated to exist
// before establishing the connection.
func (ctl *Controller) TailLogs(c *gin.Context) {
    token := c.Param("token")

    // Basic validation of token length (as per DTO constraint)
    if len(token) != 64 {
        BadRequest(c, "Invalid token")
        return
    }

    // Verify the token maps to an existing profile
    profileId, err := ctl.repositories.ProfileRepo.FindIdByToken(token)
    if err != nil {
        ctl.server.Logger.Alert(err)
        Error(c, "Error validating token")
        return
    }

    if profileId == nil {
        NotFound(c, "Profile not found")
        return
    }

    // Delegate websocket upgrade and subscription to the realtime service
    ctl.server.RealTime.ConnectTail(c)
}
