package controller

import (
	"log"
	"metabee/internal/adapter"
	"metabee/internal/model/dao"
	"metabee/internal/model/dto"
	"metabee/internal/service"
	"metabee/internal/util"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Register(c *gin.Context) {

	var input dto.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var err error
	user := adapter.UserAdapter{}.DtoToDao(input)
	user.Password, err = util.HashPassword(user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao hashear a senha"})
		return
	}

	var userDao dao.UserDao
	user, err = userDao.CreateUser(user)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := service.GenerateJWT(user.ID.Hex())
	if err != nil {
		log.Println("erro ao gerar token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"token": token})
}

func ValidateToken(c *gin.Context) {
	userID, exists := c.Get("userID")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message": "Token válido",
		"user_id": userID,
	})
}
