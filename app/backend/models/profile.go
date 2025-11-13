package models

import (
	"logger/core"
	"logger/core/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Profile struct {
	Model

	UserId uuid.UUID `gorm:"type:uuid;index;"`

	Name     string  `gorm:"type:varchar(255);"`
	Token    string  `gorm:"type:varchar(64);"`
	Trackers *string // name,pattern,platform;name,pattern,platform
}

const TokenLength = 64

func (p *Profile) BeforeCreate(tx *gorm.DB) (err error) {
	if p.ID == uuid.Nil {
		p.ID = uuid.New()
	}
	if p.Token == "" {
		p.Token = utils.RandomString(TokenLength)
	}
	return
}

const (
	InApp = 1
	Email = 2
	Both  = 3 // In-app and Email
)

func seedProfiles(s *core.Server, usersIds []uuid.UUID) []uuid.UUID {
	profileIds := []uuid.UUID{}

	if s.Config.Mode == core.Development {
		for i := range usersIds {
			for range 5 {
				profile := Profile{
					UserId: usersIds[i],
					Name:   "Profile " + utils.RandomString(6),
				}

				s.DB.Create(&profile)
				profileIds = append(profileIds, profile.ID)
			}
		}
	}

	return profileIds
}
