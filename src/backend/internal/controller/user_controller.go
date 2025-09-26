package controller

import (
	"metabee/internal/adapter"
	"metabee/internal/model/dao"
	"metabee/internal/model/dto"
	"metabee/internal/service"
	"metabee/internal/util"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

func Register(c *gin.Context) {

	var input dto.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	var adapter adapter.UserAdapter
	userOrm := adapter.DtoToOrm(input)

	var err error
	userOrm.PasswordHash, err = util.HashPassword(userOrm.PasswordHash)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao hashear a senha"})
		return
	}
	userOrm.Id = uuid.NewString()

	var userDao dao.UserDao
	if err := userDao.Register(userOrm); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	token, err := service.GenerateJWT(userOrm.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(200, gin.H{
		"access_token": token,
	})
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
