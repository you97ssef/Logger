package controllers

import (
	"logger/dtos"
	"logger/helpers"
	"logger/models"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctl *Controller) GetProfiles(c *gin.Context) {
	var userId = helpers.GetUserId(ctl.server.Jwt, c)

	profiles, err := ctl.repositories.ProfileRepo.FindByUserId(userId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting profiles")
		return
	}

	Ok(c, profiles, "Profiles retrieved successfully")
}

func (ctl *Controller) CreateProfile(c *gin.Context) {
	var newProfileDTO dtos.NewProfileDTO

	if err := c.ShouldBindJSON(&newProfileDTO); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	if newProfileDTO.Trackers != nil {
		for _, t := range *newProfileDTO.Trackers {
			if t.Platform != models.InApp && t.Platform != models.Email && t.Platform != models.Both {
				BadRequest(c, "Invalid tracker platform")
				return
			}
		}
	}

	userId := helpers.GetUserId(ctl.server.Jwt, c)

	exists, err := ctl.repositories.UserRepo.ExistById(userId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error checking user existence")
		return
	}
	
	if !exists {
		Unauthorized(c, "Account not found")
		return
	}

	profile := &models.Profile{
		UserId: userId,
		Name:   newProfileDTO.Name,
	}

	if newProfileDTO.Trackers != nil {
		profile.Trackers = helpers.TrackersToString(&dtos.UpdateProfileDTO{Trackers: newProfileDTO.Trackers})
	}

	if err := ctl.repositories.ProfileRepo.Save(profile); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error creating profile")
		return
	}

	Ok(c, profile, "Profile created successfully")
}

func (ctl *Controller) UpdateProfile(c *gin.Context) {
	var updateProfileDTO dtos.UpdateProfileDTO

	if err := c.ShouldBindJSON(&updateProfileDTO); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	if updateProfileDTO.Trackers != nil {
		for _, t := range *updateProfileDTO.Trackers {
			if t.Platform != models.InApp && t.Platform != models.Email && t.Platform != models.Both {
				BadRequest(c, "Invalid tracker platform")
				return
			}
		}
	}

	var id = c.Param("id")

	profileUuid, err := uuid.Parse(id)

	if err != nil {
		BadRequest(c, "Invalid profile ID")
		return
	}

	profile, err := ctl.repositories.ProfileRepo.FindById(profileUuid)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error finding profile")
		return
	}

	if profile == nil {
		NotFound(c, "Profile not found")
		return
	}

	userId := helpers.GetUserId(ctl.server.Jwt, c)

	if profile.UserId != userId {
		Forbidden(c, "You do not have permission to update this profile")
		return
	}

	if updateProfileDTO.Name != nil {
		profile.Name = *updateProfileDTO.Name
	}
	if updateProfileDTO.Trackers != nil {
		profile.Trackers = helpers.TrackersToString(&updateProfileDTO)
	}

	if err := ctl.repositories.ProfileRepo.Save(profile); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error updating profile")
		return
	}

	Ok(c, profile, "Profile updated successfully")
}

func (ctl *Controller) DeleteProfile(c *gin.Context) {
	var id = c.Param("id")

	profileUuid, err := uuid.Parse(id)

	if err != nil {
		BadRequest(c, "Invalid profile ID")
		return
	}

	profile, err := ctl.repositories.ProfileRepo.FindById(profileUuid)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error finding profile")
		return
	}

	if profile == nil {
		NotFound(c, "Profile not found")
		return
	}

	userId := helpers.GetUserId(ctl.server.Jwt, c)

	if profile.UserId != userId {
		Forbidden(c, "You do not have permission to delete this profile")
		return
	}

	if err := ctl.repositories.ProfileRepo.Delete(profile); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error deleting profile")
		return
	}
	
	Ok(c, nil, "Profile deleted successfully")
}

func (ctl *Controller) GetUserProfiles(c *gin.Context) {
	var id = c.Param("id")

	profileUUID, err := uuid.Parse(id)

	if err != nil {
		BadRequest(c, "Invalid user ID")
		return
	}

	profiles, err := ctl.repositories.ProfileRepo.FindByUserId(profileUUID)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting profiles")
		return
	}

	Ok(c, profiles, "Profiles retrieved successfully")
}
