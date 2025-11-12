package helpers

import (
	"logger/core/services"
	"logger/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func PrepareToken(jwtService *services.Jwt, user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"id": user.ID,

		"name":  user.Name,
		"email": user.Email,

		"role": user.Role,

		"created_at":  user.CreatedAt,
		"updated_at":  user.UpdatedAt,
		"verified_at": user.VerifiedAt,
	}

	return jwtService.GenerateToken(claims)
}

func PrepareVerificationToken(jwtService *services.Jwt, email string) (string, error) {
	token, err := jwtService.GenerateToken(jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
	})

	return token, err
}

func GetUserId(jwtService *services.Jwt, c *gin.Context) uuid.UUID {
	return jwtService.GetValue(c.MustGet("claims").(jwt.MapClaims), "id").(uuid.UUID)
}
