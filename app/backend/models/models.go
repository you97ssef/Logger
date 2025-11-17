package models

import "logger/core"

func Migrate(s *core.Server) {
	s.DB.AutoMigrate(&migration{})
	s.DB.AutoMigrate(&User{})
	s.DB.AutoMigrate(&Profile{})
	s.DB.AutoMigrate(&Entry{})
}

func Seed(s *core.Server) {
	if checkMigration(s.DB, "seed") {
		return
	}

	usersIds := seedUsers(s)
	profileIds := seedProfiles(s, usersIds)
	seedEntries(s, profileIds)

	createMigration(s.DB, "seed")
}
