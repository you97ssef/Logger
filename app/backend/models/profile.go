package models

import (
	"logger/core/utils"

	"github.com/google/uuid"
	"gorm.io/gorm"
)

type Profile struct {
	Model

	UserId uuid.UUID `gorm:"type:uuid;index;"`

	Name     string  `gorm:"type:varchar(255);"`
	Token    string  `gorm:"type:varchar(64);"`
	Trackers *string // name,pattern,frequency,platform;name,pattern,frequency,platform
}

const TokenLength = 64

func (p *Profile) BeforeCreate(tx *gorm.DB) (err error) {
	if p.Token == "" {
		p.Token = utils.RandomString(TokenLength)
	}
	return
}
