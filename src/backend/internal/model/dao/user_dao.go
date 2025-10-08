package dao

import (
	"fmt"
	"metabee/internal/database"
	"metabee/internal/model/orm"
)

type UserDao struct{}

func (dao *UserDao) Register(orm orm.User) error {
	if err := database.DB.QueryRow("INSERT INTO users (name, email, password) VALUES ($1, $2, $3)",
		orm.Name, orm.Email, orm.PasswordHash); err != nil {
		return fmt.Errorf("erro ao fazer registro")
	}
	return nil
}

func (dao *UserDao) Login(user orm.User) error {

	var result orm.User
	if err := database.DB.QueryRow("SELECT * FROM users WHERE email = $1", user.Email).Scan(&result).Error; err != nil {
		return fmt.Errorf("email ou senha incorretos")
	}

	return nil
}

func (dao *UserDao) GetUserByEmail(email string) (orm.User, error) {

	var result orm.User
	if err := database.DB.QueryRow("SELECT * FROM users WHERE email = $1", email).Scan(&result); err != nil {
		return orm.User{}, err
	}

	return result, nil
}
