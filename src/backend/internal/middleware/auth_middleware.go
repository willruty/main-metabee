package middleware

import (
	"metabee/internal/model/dao"
	"metabee/internal/model/orm"
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

	var userDao dao.UserDao
	err = userDao.Login(orm.User{Id: userId})
	if err != nil {
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "User not found"})
		return
	}

	c.Set("userID", userId)

	c.Next()
}
