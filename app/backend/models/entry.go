package models

import "github.com/google/uuid"

type Entry struct {
	SlimModel

	ProfileId uuid.UUID `gorm:"type:uuid;index;"`
	Text      string
}
