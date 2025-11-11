package routes

import (
	"time"

	"github.com/gin-contrib/cors"
)

func (r *Routes) RegisterCors() {
	r.server.Router.Use(
		cors.New(
			cors.Config{
				AllowOrigins:     []string{"*"},
				AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
				AllowHeaders:     []string{"Origin", "Authorization", "Content-Type"},
				ExposeHeaders:    []string{"Content-Length", "Content-Type", "Authorization"},
				AllowCredentials: true,
				AllowOriginFunc: func(origin string) bool {
					return origin == "*"
				},
				MaxAge: 12 * time.Hour,
			},
		),
	)
}
