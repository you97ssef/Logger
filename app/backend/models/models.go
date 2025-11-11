package models

import "logger/core"

func Migrate(s *core.Server) {
	s.DB.AutoMigrate(&migration{})
}

func Seed(s *core.Server) {
	if checkMigration(s.DB, "seed") {
		return
	}

	createMigration(s.DB, "seed")
}
