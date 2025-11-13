package routes

import (
	"logger/controllers"
	"logger/core"
	"logger/middleware"
)

type Routes struct {
	server *core.Server
}

func NewRoutes(s *core.Server) *Routes {
	return &Routes{
		server: s,
	}
}

func (r *Routes) RegisterRoutes(c *controllers.Controller, m *middleware.Middleware) {
	routes := r.server.Router.Group("")
	connected := r.server.Router.Group("", m.Connected())
	admin := r.server.Router.Group("", m.Connected(), m.Admin())

	routes.GET("/test", c.Test)

	routes.POST("/login", c.Login)
	routes.POST("/register", c.Register)
	routes.GET("/resend-verification", c.ResendVerification)
	routes.GET("/verify", c.Verify)
	routes.GET("/forgot-password", c.ForgotPassword)
	routes.POST("/reset-password", c.ResetPassword)
	connected.GET("/refresh-token", c.RefreshToken)
	
	connected.GET("/me", c.Me)
	connected.PUT("/me", c.UpdateAccount)
	connected.DELETE("/me", c.DeleteAccount)
	
	admin.GET("/users", c.Users)
	admin.DELETE("/users/:id", c.DeleteUser)

	connected.GET("/profiles", c.GetProfiles)
	connected.POST("/profiles", c.CreateProfile)
	connected.PUT("/profiles", c.UpdateProfile)
	connected.DELETE("/profiles/:id", c.DeleteProfile)
	
	admin.GET("/users/:id/profiles", c.GetUserProfiles)
	
	routes.POST("/log", c.LogEntry)
	connected.GET("/profiles/:id", c.CountEntries)
	connected.GET("/profiles/:id/logs", c.GetEntries)
	connected.DELETE("/profiles/:id/logs", c.ClearEntries)
	
	admin.GET("/admin-profiles/:pid", c.CountUserEntries)
	admin.GET("/admin-profiles/:pid/logs", c.GetUserEntries)
}
