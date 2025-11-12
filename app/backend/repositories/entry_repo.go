package repositories

import (
	"logger/core"
	"logger/models"
)

const EntriesPerPage = 100

type EntryRepo interface {
	CountByProfileId(id string) (int64, error)
	FindByProfileId(id string, page int) (*[]models.Entry, error)
	Save(entry *models.Entry) error
	DeleteByProfileId(id string) error
}

type EntryRepoImpl struct {
	server *core.Server
}

func NewEntryRepo(s *core.Server) *EntryRepoImpl {
	return &EntryRepoImpl{
		server: s,
	}
}

func (er *EntryRepoImpl) CountByProfileId(id string) (int64, error) {
	var count int64

	if err := er.server.DB.Model(&models.Entry{}).Where("profile_id = ?", id).Count(&count).Error; err != nil {
		return 0, err
	}

	return count, nil
}

func (er *EntryRepoImpl) FindByProfileId(id string, page int) (*[]models.Entry, error) {
	var entries *[]models.Entry

	if err := er.server.DB.Where("profile_id = ?", id).Order("created_at desc").Offset((page - 1) * EntriesPerPage).Limit(EntriesPerPage).Find(&entries).Error; err != nil {
		return nil, err
	}

	return entries, nil
}

func (er *EntryRepoImpl) Save(entry *models.Entry) error {
	if err := er.server.DB.Save(entry).Error; err != nil {
		return err
	}

	return nil
}

func (er *EntryRepoImpl) DeleteByProfileId(id string) error {
	if err := er.server.DB.Where("profile_id = ?", id).Delete(&models.Entry{}).Error; err != nil {
		return err
	}

	return nil
}
