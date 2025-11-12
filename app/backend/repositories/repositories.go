package repositories

import "logger/core"

type Repositories struct {
	UserRepo    UserRepo
	ProfileRepo ProfileRepo
	EntryRepo   EntryRepo
}

func SetupRepositories(s *core.Server) *Repositories {
	userRepo := NewUserRepo(s)
	profileRepo := NewProfileRepo(s)
	entryRepo := NewEntryRepo(s)

	return &Repositories{
		UserRepo:    userRepo,
		ProfileRepo: profileRepo,
		EntryRepo:   entryRepo,
	}
}
