package controllers

import (
	"logger/dtos"
	"logger/helpers"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctl *Controller) Me(c *gin.Context) {
	userId := helpers.GetUserId(ctl.server.Jwt, c)
	
	user, err := ctl.repositories.UserRepo.FindById(userId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting account by ID")
		return
	}
	
	if user == nil {
		Unauthorized(c, "Account not found")
		return
	}

	Ok(c, user, "User retrieved successfully")
}

func (ctl *Controller) UpdateAccount(c *gin.Context) {
	var dto dtos.UpdateAccountDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	userId := helpers.GetUserId(ctl.server.Jwt, c)

	user, err := ctl.repositories.UserRepo.FindById(userId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting account by ID")
		return
	}

	if user == nil {
		Unauthorized(c, "Account not found")
		return
	}

	user.Name = dto.Name

	if err := ctl.repositories.UserRepo.Save(user); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error updating account")
		return
	}

	Ok(c, user, "Account updated successfully")
}

func (ctl *Controller) DeleteAccount(c *gin.Context) {
	var dto dtos.DeleteAccountDTO

	if err := c.ShouldBindJSON(&dto); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	userId := helpers.GetUserId(ctl.server.Jwt, c)

	user, err := ctl.repositories.UserRepo.FindById(userId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting account by ID")
		return
	}

	if user == nil {
		Unauthorized(c, "Account not found")
		return
	}

	validPassword := ctl.server.Hasher.IsValidPassword(user.Password, dto.Password)

	if !validPassword {
		Unauthorized(c, "Incorrect password")
		return
	}

	if err := ctl.repositories.UserRepo.Delete(user); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error deleting account")
		return
	}

	Ok(c, nil, "Account deleted successfully")
}

func (ctl *Controller) Users(c *gin.Context) {
	users, err := ctl.repositories.UserRepo.All()

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting users")
		return
	}

	Ok(c, users, "Users retrieved successfully")
}

func (ctl *Controller) DeleteUser(c *gin.Context) {
	id := c.Param("id")

	uuid, err := uuid.Parse(id)

	if err != nil {
		BadRequest(c, "Invalid user ID")
		return
	}

	user, err := ctl.repositories.UserRepo.FindById(uuid)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting user by ID")
		return
	}

	if user == nil {
		Unauthorized(c, "User not found")
		return
	}

	if err := ctl.repositories.UserRepo.Delete(user); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error deleting user")
		return
	}
	
	Ok(c, nil, "User deleted successfully")
}