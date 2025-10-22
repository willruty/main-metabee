package adapter

import (
	"metabee/internal/model/dao"
	"metabee/internal/model/dto"
)

type UserAdapter struct{}

func (adapter UserAdapter) DtoToDao(user dto.User) dao.UserDao {
	return dao.UserDao{
		Name:     user.Name,
		Email:    user.Email,
		Password: user.Password,
	}
}

func (adapter UserAdapter) LoginInputToDao(input dao.LoginInput) dao.UserDao {
	return dao.UserDao{
		Email:    input.Email,
		Password: input.Password,
	}
}
