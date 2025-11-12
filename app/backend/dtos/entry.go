package dtos

type NewEntryDTO struct {
	Text string `json:"text" binding:"required"`
	Token string `json:"token" binding:"required,len=64"`
}
