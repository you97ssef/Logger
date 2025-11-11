package models

import "gorm.io/gorm"

type migration struct {
	gorm.Model
	Text string `json:"text"`
}

func createMigration(db *gorm.DB, text string) {
	db.Create(&migration{Text: text})
}

func checkMigration(db *gorm.DB, text string) bool {
	var migration migration
	db.First(&migration, "text = ?", text)
	return migration.ID > 0
}
