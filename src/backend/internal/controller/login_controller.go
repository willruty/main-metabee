package controller

import (
	"metabee/internal/model/dao"
	"metabee/internal/service"
	"metabee/internal/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginOutput struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	UserID       string `json:"user_id"`
}

func Login(c *gin.Context) {

	var input LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": err.Error()})
		return
	}

	var userDao dao.UserDao
	user, err := userDao.FindUserByEmail(input.Email)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	if !util.CheckPasswordHash(input.Password, user.Password) {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	token, err := service.GenerateJWT(user.ID.String())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
