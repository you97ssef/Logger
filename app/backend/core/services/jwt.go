package services

import (
	"fmt"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
)

func NewJwt(secretKey string, days int) *Jwt {
	return &Jwt{
		secretKey: secretKey,
		accessTTL: time.Duration(days) * 24 * time.Hour,
	}
}

type Jwt struct {
	secretKey string
	accessTTL time.Duration
}

func (j *Jwt) GetAccessTTL() time.Duration {
	return j.accessTTL
}

func (j *Jwt) GenerateToken(claims jwt.MapClaims) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString([]byte(j.secretKey))
	if err != nil {
		return "", err
	}
	return tokenString, nil
}

func (j *Jwt) VerifyToken(tokenString string) (jwt.MapClaims, error) {
	token, err := jwt.ParseWithClaims(
		tokenString,
		jwt.MapClaims{},
		func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, fmt.Errorf("unexpected signing method")
			}
			return []byte(j.secretKey), nil
		},
		jwt.WithValidMethods([]string{jwt.SigningMethodHS256.Alg()}),
	)
	if err != nil {
		// return the underlying error so callers can distinguish expiry vs other issues
		return nil, err
	}
	if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
		return claims, nil
	}
	return nil, fmt.Errorf("invalid token")
}

func (js *Jwt) VerifyTokenFromGinContext(c *gin.Context) (jwt.MapClaims, error) {
	auth := c.GetHeader("Authorization")

	if len(auth) == 0 {
		auth = c.Query("token")

		if len(auth) == 0 {
			return nil, fmt.Errorf("no token provided")
		}

		auth = "Bearer " + auth
	}

	token := strings.Replace(auth, "Bearer ", "", 1)

	claims, err := js.VerifyToken(token)

	if err != nil {
		return nil, err
	}

	return claims, nil
}

func (j *Jwt) GetValue(claims jwt.Claims, key string) interface{} {
	return claims.(jwt.MapClaims)[key]
}
