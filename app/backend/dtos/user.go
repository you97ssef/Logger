package dtos

type UpdateAccountDTO struct {
	Name            string `json:"username" binding:"required,max=255"`
}

type DeleteAccountDTO struct {
	Password        string `json:"password" binding:"required,min=8,max=255"`
}
