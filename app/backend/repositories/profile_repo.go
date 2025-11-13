package repositories

import (
	"logger/core"
	"logger/models"

	"github.com/google/uuid"
)

type ProfileRepo interface {
	FindByUserId(userId uuid.UUID) (*[]models.Profile, error)
	FindIdByToken(token string) (*uuid.UUID, error)
	FindById(id uuid.UUID) (*models.Profile, error)
	Save(profile *models.Profile) error
	Delete(profile *models.Profile) error
}

type ProfileRepoImpl struct {
	server *core.Server
}

func NewProfileRepo(s *core.Server) *ProfileRepoImpl {
	return &ProfileRepoImpl{
		server: s,
	}
}

func (pr *ProfileRepoImpl) FindByUserId(userId uuid.UUID) (*[]models.Profile, error) {
	var profiles *[]models.Profile

	if err := pr.server.DB.Where("profile_id = ?", userId).Find(&profiles).Error; err != nil {
		return nil, err
	}

	return profiles, nil
}

func (pr *ProfileRepoImpl) FindIdByToken(token string) (*uuid.UUID, error) {
	var profile models.Profile

	if err := pr.server.DB.Select("id").Where("token = ?", token).First(&profile).Error; err != nil {
		if err.Error() == "record not found" {
			return nil, nil
		}
		return nil, err
	}

	return &profile.ID, nil
}

func (pr *ProfileRepoImpl) FindById(id uuid.UUID) (*models.Profile, error) {
	var profile models.Profile

	if err := pr.server.DB.Where("id = ?", id).First(&profile).Error; err != nil {
		if err.Error() == "record not found" {
			return nil, nil
		}
		return nil, err
	}

	return &profile, nil
}

func (pr *ProfileRepoImpl) Save(profile *models.Profile) error {
	if err := pr.server.DB.Save(profile).Error; err != nil {
		return err
	}

	return nil
}

func (pr *ProfileRepoImpl) Delete(profile *models.Profile) error {
	if err := pr.server.DB.Where("profile_id = ?", profile.ID).Delete(&models.Entry{}).Error; err != nil {
		return err
	}

	if err := pr.server.DB.Delete(profile).Error; err != nil {
		return err
	}

	return nil
}
