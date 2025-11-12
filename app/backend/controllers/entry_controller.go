package controllers

import (
	"logger/dtos"
	"logger/models"
	"strconv"

	"github.com/gin-gonic/gin"
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

	entry := &models.Entry{
		ProfileId: *profileId,
		Text:      newEntryDTO.Text,
	}

	if err := ctl.repositories.EntryRepo.Save(entry); err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error logging entry")
		return
	}

	Ok(c, entry, "Entry logged successfully")
}

func (ctl *Controller) CountEntries(c *gin.Context) {
	var profileId = c.Param("profileId")

	entries, err := ctl.repositories.EntryRepo.CountByProfileId(profileId)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error counting entries")
		return
	}

	Ok(c, entries, "Entries counted successfully")
}

func (ctl *Controller) GetEntries(c *gin.Context) {
	var profileId = c.Param("profileId")
	var page = c.Query("page")

	pageInt, err := strconv.Atoi(page)
	if err != nil || pageInt < 1 {
		ctl.server.Logger.Alert(err)
		BadRequest(c, "Invalid page number")
		return
	}

	entries, err := ctl.repositories.EntryRepo.FindByProfileId(profileId, pageInt)

	if err != nil {
		ctl.server.Logger.Alert(err)
		Error(c, "Error getting entries")
		return
	}

	Ok(c, entries, "Entries retrieved successfully")
}
