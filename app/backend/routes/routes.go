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

	routes.GET("/test", c.Test)
}
