package models

type User struct {
	Model

	Name string `gorm:"type:varchar(255);"`
	Role uint8  `gorm:"default:2;"`

	Email    string `gorm:"type:varchar(255);uniqueIndex;"`
	Password string `json:"-" gorm:"type:varchar(255);"`
}

const (
	Admin      = 1
	NormalUser = 2
)
