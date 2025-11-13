package controllers

import (
	"encoding/json"
	"logger/dtos"
	"logger/helpers"
	"logger/models"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func (ctl *Controller) LogEntry(c *gin.Context) {
	var newEntryDTO dtos.NewEntryDTO

	if err := c.ShouldBindJSON(&newEntryDTO); err != nil {
		BadRequest(c, "Invalid request")
		return
	}

	profileId, err := ctl.repositories.ProfileRepo.FindIdByToken(newEntryDTO.Token)

	if err != nil {
		ctl.server.Logger.Alert(err)
		BadRequest(c, "Invalid profile token")
		return
	}

	if profileId == nil {
		BadRequest(c, "Invalid profile token")
		return
	}

	entry := &models.Entry{
		ProfileId: *profileId,
		Text:      newEntryDTO.Text,
	}

	if err := ctl.repositories.EntryRepo.Save(entry); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error logging entry")
		return
	}

	if payload, err := json.Marshal(entry); err == nil {
		ctl.server.RealTime.BroadcastToToken(newEntryDTO.Token, payload)
	} else {
		ctl.server.Logger.Alert(err)
	}

	// TODO: Implement webhook notification here and email notification

	Ok(c, entry, "Entry logged successfully")
}

func (ctl *Controller) CountEntries(c *gin.Context) {
	var profileId = c.Param("id")

	profileUuid, err := uuid.Parse(profileId)

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

	if profile == nil || profile.UserId != helpers.GetUserId(ctl.server.Jwt, c) {
		NotFound(c, "Profile not found")
		return
	}

	entries, err := ctl.repositories.EntryRepo.CountByProfileId(profileUuid)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error counting entries")
		return
	}

	Ok(c, entries, "Entries counted successfully")
}

func (ctl *Controller) GetEntries(c *gin.Context) {
	var profileId = c.Param("id")
	var page = c.Query("page")

	pageInt, err := strconv.Atoi(page)

	if err != nil || pageInt < 1 {
		if err != nil {
			ctl.server.Logger.Alert(err)
		}
		BadRequest(c, "Invalid page number")
		return
	}

	profileUuid, err := uuid.Parse(profileId)

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

	if profile == nil || profile.UserId != helpers.GetUserId(ctl.server.Jwt, c) {
		NotFound(c, "Profile not found")
		return
	}

	entries, err := ctl.repositories.EntryRepo.FindByProfileId(profileUuid, pageInt)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting entries")
		return
	}

	Ok(c, entries, "Entries retrieved successfully")
}

func (ctl *Controller) ClearEntries(c *gin.Context) {
	profileId := c.Param("id")
	
	profileUuid, err := uuid.Parse(profileId)

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

	if profile == nil || profile.UserId != helpers.GetUserId(ctl.server.Jwt, c) {
		NotFound(c, "Profile not found")
		return
	}
	
	if err := ctl.repositories.EntryRepo.DeleteByProfileId(profileUuid); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error clearing entries")
		return
	}

	Ok(c, nil, "Entries cleared successfully")
}

func (ctl *Controller) CountUserEntries(c *gin.Context) {
	var profileId = c.Param("pid")

	profileUuid, err := uuid.Parse(profileId)

	if err != nil {
		BadRequest(c, "Invalid profile ID")
		return
	}

	entries, err := ctl.repositories.EntryRepo.CountByProfileId(profileUuid)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error counting entries")
		return
	}

	Ok(c, entries, "Entries counted successfully")
}

func (ctl *Controller) GetUserEntries(c *gin.Context) {
	var profileId = c.Param("pid")
	var page = c.Query("page")

	pageInt, err := strconv.Atoi(page)

	if err != nil || pageInt < 1 {
		if err != nil {
			ctl.server.Logger.Alert(err)
		}
		BadRequest(c, "Invalid page number")
		return
	}

	profileUuid, err := uuid.Parse(profileId)

	if err != nil {
		BadRequest(c, "Invalid profile ID")
		return
	}

	entries, err := ctl.repositories.EntryRepo.FindByProfileId(profileUuid, pageInt)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting entries")
		return
	}

	Ok(c, entries, "Entries retrieved successfully")
}
