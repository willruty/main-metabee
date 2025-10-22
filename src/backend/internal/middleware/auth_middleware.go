package middleware

import (
	"metabee/internal/model/dao"
	"metabee/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context) {

	authHeader := c.GetHeader("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token não fornecido"})
		return
	}

	token := strings.TrimPrefix(authHeader, "Bearer ")

	userId, err := service.ValidateJWT(token)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}

	userDao := dao.UserDao{}
	loggedInUser, err := userDao.FindUserByID(userId)
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Erro ao verificar usuário"})
		return
	}

	if loggedInUser.Email == "" {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Usuário não encontrado"})
		return
	}

	c.Set("currentUser", loggedInUser)
	c.Next()
}
