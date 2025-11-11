package middleware

import (
	"logger/core"
	"logger/repositories"
)

type Middleware struct {
	server       *core.Server
	repositories *repositories.Repositories
}

func NewMiddleware(s *core.Server, r *repositories.Repositories) *Middleware {
	return &Middleware{
		server:       s,
		repositories: r,
	}
}
