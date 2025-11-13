package repositories

import (
	"logger/core"
	"logger/models"

	"github.com/google/uuid"
)

type UserRepo interface {
	FindByEmail(email string) (*models.User, error)
	FindById(id uuid.UUID) (*models.User, error)
	ExistByEmail(email string) (bool, error)
	ExistById(id uuid.UUID) (bool, error)
	Verified(email string) (bool, error)
	All() (*[]models.User, error)
	Save(user *models.User) error
	Delete(user *models.User) error
}

type UserRepoImpl struct {
	server *core.Server
}

func NewUserRepo(s *core.Server) *UserRepoImpl {
	return &UserRepoImpl{
		server: s,
	}
}

func (ur *UserRepoImpl) FindByEmail(email string) (*models.User, error) {
	var user models.User

	if err := ur.server.DB.Where("email = ?", email).First(&user).Error; err != nil {
		if err.Error() == "record not found" {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepoImpl) FindById(id uuid.UUID) (*models.User, error) {
	var user models.User

	if err := ur.server.DB.Where("id = ?", id).First(&user).Error; err != nil {
		if err.Error() == "record not found" {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (ur *UserRepoImpl) ExistByEmail(email string) (bool, error) {
	var count int64

	if err := ur.server.DB.Model(&models.User{}).Where("email = ?", email).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (ur *UserRepoImpl) ExistById(id uuid.UUID) (bool, error) {
	var count int64
	
	if err := ur.server.DB.Model(&models.User{}).Where("id = ?", id).Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (ur *UserRepoImpl) Verified(email string) (bool, error) {
	var count int64

	if err := ur.server.DB.Model(&models.User{}).
		Where("email = ? AND verified_at IS NOT NULL", email).
		Count(&count).Error; err != nil {
		return false, err
	}

	return count > 0, nil
}

func (ur *UserRepoImpl) All() (*[]models.User, error) {
	var users *[]models.User

	if err := ur.server.DB.Where("ID != 1").Find(&users).Error; err != nil {
		return nil, err
	}

	return users, nil
}

func (ur *UserRepoImpl) Save(user *models.User) error {
	if err := ur.server.DB.Save(user).Error; err != nil {
		return err
	}

	return nil
}

func (ur *UserRepoImpl) Delete(user *models.User) error {
	var profilesIds *[]uuid.UUID

	if err := ur.server.DB.Model(&models.Profile{}).Where("user_id = ?", user.ID).
		Pluck("id", &profilesIds).Error; err != nil {
		return err
	}

	if err := ur.server.DB.Where("profile_id IN ?", *profilesIds).Delete(&models.Entry{}).Error; err != nil {
		return err
	}

	if err := ur.server.DB.Where("user_id = ?", user.ID).Delete(&models.Profile{}).Error; err != nil {
		return err
	}

	if err := ur.server.DB.Delete(user).Error; err != nil {
		return err
	}

	return nil
}
