package dao

import (
	"metabee/internal/database"
	"metabee/internal/model/orm"
)

type UserDao struct{}

func (dao *UserDao) Register(orm orm.User) error {

	if err := database.DB.Create(&orm).Error; err != nil {
		return err
	}
	return nil
}

func (dao *UserDao) Login(orm orm.User) error {

	if err := database.DB.Where("Id = ?", orm.Id).First(&orm).Error; err != nil {
		return err
	}
	return nil
}

func (dao *UserDao) GetUserByEmail(email string) (orm.User, error) {
	var user orm.User

	if err := database.DB.Model(&orm.User{}).Where("email = ?", email).First(&user).Error; err != nil {
		return user, err
	}

	return user, nil
}
