package dtos

type RegisterDTO struct {
	Name            string `json:"username" binding:"required,max=255"`
	Email           string `json:"email" binding:"required,email,max=255"`
	Password        string `json:"password" binding:"required,max=255"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}

type LoginDTO struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type ResetPasswordDTO struct {
	Token           string `json:"token" binding:"required"`
	Password        string `json:"password" binding:"required,max=255"`
	ConfirmPassword string `json:"confirm_password" binding:"required,eqfield=Password"`
}
