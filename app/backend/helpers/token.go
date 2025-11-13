package helpers

import (
	"logger/core/services"
	"logger/models"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
)

func PrepareLoginToken(jwtService *services.Jwt, user *models.User) (string, error) {
	claims := jwt.MapClaims{
		"id": user.ID,

		"name":  user.Name,
		"email": user.Email,

		"role": user.Role,

		"created_at":  user.CreatedAt,
		"updated_at":  user.UpdatedAt,
		"verified_at": user.VerifiedAt,

		"exp": time.Now().Add(jwtService.GetAccessTTL()).Unix(),
	}

	return jwtService.GenerateToken(claims)
}

func PreparePurposeToken(jwtService *services.Jwt, email string, purpose string) (string, error) {
	token, err := jwtService.GenerateToken(jwt.MapClaims{
		"email": email,
		"exp":   time.Now().Add(time.Hour * 24).Unix(),
		"purpose": purpose,
	})

	return token, err
}

func GetUserId(jwtService *services.Jwt, c *gin.Context) uuid.UUID {
	return jwtService.GetValue(c.MustGet("claims").(jwt.MapClaims), "id").(uuid.UUID)
}

func IsAdmin(jwtService *services.Jwt, claims jwt.MapClaims) bool {
	return jwtService.GetValue(claims, "role") == models.Admin
}
