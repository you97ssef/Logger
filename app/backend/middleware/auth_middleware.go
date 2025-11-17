package middleware

import (
	"errors"
	"logger/controllers"
	"logger/helpers"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func (m *Middleware) Connected() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := m.server.Jwt.VerifyTokenFromGinContext(c)

		if err != nil {
			m.server.Logger.Alert(err.Error())
			if errors.Is(err, jwt.ErrTokenExpired) {
				controllers.Unauthorized(c, "Token expired")
			} else {
				controllers.Unauthorized(c, "Invalid token")
			}
			return
		}

		c.Set("claims", claims)

		c.Next()
	}
}

func (m *Middleware) Admin() gin.HandlerFunc {
	return func(c *gin.Context) {
		claims, err := m.server.Jwt.VerifyTokenFromGinContext(c)

		if err != nil {
			m.server.Logger.Alert(err.Error())
			if errors.Is(err, jwt.ErrTokenExpired) {
				controllers.Unauthorized(c, "Token expired")
			} else {
				controllers.Unauthorized(c, "Invalid token")
			}
			return
		}

		if !helpers.IsAdmin(m.server.Jwt, claims) {
			controllers.Forbidden(c, "Admin access required")
			return
		}

		c.Set("claims", claims)

		c.Next()
	}
}
