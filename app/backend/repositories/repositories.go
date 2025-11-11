package repositories

import "logger/core"

type Repositories struct {
}

func SetupRepositories(s *core.Server) *Repositories {
	return &Repositories{}
}
