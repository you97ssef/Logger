package main

import (
	"logger/controllers"
	"logger/core"
	"logger/middleware"
	"logger/models"
	"logger/repositories"
	"logger/routes"
)

func main() {
	server := &core.Server{}

	server.Initialize("./environment.json")

	models.Migrate(server)
	models.Seed(server)
	repositories := repositories.SetupRepositories(server)

	middleware := middleware.NewMiddleware(server, repositories)
	controllers := controllers.NewController(server, repositories)
	routes := routes.NewRoutes(server)

	routes.RegisterCors()
	routes.RegisterRoutes(controllers, middleware)

	server.Run()
}
