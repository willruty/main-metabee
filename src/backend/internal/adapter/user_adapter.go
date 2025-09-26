package adapter

import (
	"metabee/internal/model/dto"
	"metabee/internal/model/orm"
)

type UserAdapter struct{}

func (adapter *UserAdapter) DtoToOrm(user dto.User) orm.User {
	return orm.User{
		Name:         user.Name,
		Email:        user.Email,
		PasswordHash: user.Password,
	}
}
