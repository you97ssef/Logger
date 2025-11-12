package controllers

import (
	"logger/dtos"
	"logger/helpers"
	"logger/models"
	"time"

	"github.com/gin-gonic/gin"
)

func (ctl *Controller) Login(c *gin.Context) {
	var login dtos.LoginDTO

	if err := c.ShouldBindJSON(&login); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	user, err := ctl.repositories.UserRepo.FindByEmail(login.Email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting account by email")
		return
	}

	if user == nil {
		BadRequest(c, "Email not found")
		return
	}

	if !ctl.server.Hasher.IsValidPassword(user.Password, login.Password) {
		BadRequest(c, "Password is invalid")
		return
	}

	jwt, err := helpers.PrepareToken(ctl.server.Jwt, user)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error generating token")
		return
	}

	Ok(c, jwt, "Logged in successfully")
}

func (ctl *Controller) Register(c *gin.Context) {
	var register dtos.RegisterDTO

	if err := c.ShouldBindJSON(&register); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	exists, err := ctl.repositories.UserRepo.ExistByEmail(register.Email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error checking email")
		return
	}

	if exists {
		BadRequest(c, "Email already exists")
		return
	}

	password, err := ctl.server.Hasher.HashPassword(register.Password)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error hashing password")
		return
	}

	user := &models.User{
		Name:     register.Name,
		Email:    register.Email,
		Password: password,
	}

	err = ctl.repositories.UserRepo.Save(user)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error saving user")
		return
	}

	err = ctl.sendVerification(user.Email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error sending verification email")
		return
	}

	token, err := helpers.PrepareToken(ctl.server.Jwt, user)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error generating token")
		return
	}

	Created(c, token, "Account created successfully. Check your email to verify your account")
}

func (ctl *Controller) sendVerification(email string) error {
	var to []string
	to = append(to, email)

	token, err := helpers.PrepareVerificationToken(ctl.server.Jwt, email)

	if err != nil {
		return err
	}

	link := ctl.server.Config.FrontendURL + "/verify?token=" + token

	return ctl.server.Mailer.SendEmail(
		to,
		"Verify your email",
		"Click the link below to verify your email: <a href='"+link+"'>"+link+"</a>",
	)
}

func (ctl *Controller) Verify(c *gin.Context) {
	token := c.Query("token")

	claims, err := ctl.server.Jwt.VerifyToken(token)

	if err != nil {
		Unauthorized(c, "Invalid token")
		return
	}

	email := claims["email"].(string)

	user, err := ctl.repositories.UserRepo.FindByEmail(email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error checking account email")
		return
	}

	if user == nil {
		Unauthorized(c, "Account not found")
		return
	}

	now := time.Now()
	user.VerifiedAt = &now

	err = ctl.repositories.UserRepo.Save(user)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error verifying email")
		return
	}

	newToken, err := helpers.PrepareToken(ctl.server.Jwt, user)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error generating token")
		return
	}

	Ok(c, newToken, "Email verified successfully")
}

func (ctl *Controller) ResendVerification(c *gin.Context) {
	var email string = c.Query("email")

	if email == "" {
		BadRequest(c, "Email is required")
		return
	}

	verified, err := ctl.repositories.UserRepo.Verified(email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error checking verification status")
		return
	}

	if verified {
		BadRequest(c, "Email already verified")
		return
	}

	err = ctl.sendVerification(email)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error sending verification email")
		return
	}

	Ok(c, nil, "Verification email sent successfully")
}
