package models

import (
	"fmt"
	"logger/core"

	"github.com/google/uuid"
)

type Entry struct {
	SlimModel

	ProfileId uuid.UUID `gorm:"type:uuid;index;"`
	Text      string
}

func seedEntries(s *core.Server, profileIds []uuid.UUID) {
	if s.Config.Mode == core.Development {
		for i := range profileIds {
			for j := range 300 {
				entry := Entry{
					ProfileId: profileIds[i],
					Text:      "Sample log entry " + fmt.Sprint(j),
				}

				s.DB.Create(&entry)
			}
		}
	}
}
