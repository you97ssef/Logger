package models

import (
	"fmt"
	"logger/core"
	"logger/core/utils"
	"time"

	"github.com/google/uuid"
)

type User struct {
	Model

	Name string `gorm:"type:varchar(255);"`
	Role uint8  `gorm:"default:2;"`

	Email    string `gorm:"type:varchar(255);uniqueIndex;"`
	Password string `json:"-" gorm:"type:varchar(255);"`

	VerifiedAt *time.Time
}

const (
	Admin      = 1
	NormalUser = 2
)

func seedUsers(s *core.Server) []uuid.UUID {
	ids := []uuid.UUID{}
	verifiedNow := time.Now()
	password, err := s.Hasher.HashPassword(utils.RandomString(32))

	if err != nil {
		s.Logger.Alert(err.Error())
		panic(err)
	}

	admin := User{
		Name:       "Youssef Bahi",
		Role:       Admin,
		Email:      "you97ssef@gmail.com",
		Password:   password,
		VerifiedAt: &verifiedNow,
	}

	s.DB.Create(&admin)
	ids = append(ids, admin.ID)

	if s.Config.Mode == core.Development {
		userPassword, err := s.Hasher.HashPassword("password")

		if err != nil {
			s.Logger.Alert(err.Error())
			panic(err)
		}

		for i := range 5 {
			var verified *time.Time
			if i%2 == 0 {
				verified = &verifiedNow
			} else {
				verified = nil
			}

			user := User{
				Name:       "User " + fmt.Sprint(i),
				Role:       NormalUser,
				Email:      "user" + fmt.Sprint(i) + "@example.com",
				Password:   userPassword,
				VerifiedAt: verified,
			}

			s.DB.Create(&user)
			ids = append(ids, user.ID)
		}
	}
	
	return ids
}
