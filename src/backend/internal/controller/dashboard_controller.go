package controller

import (
	"log"
	"metabee/internal/model/dao"
	"net/http"

	"github.com/gin-gonic/gin"
)

func Dashboard(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		log.Println("Usuário nao autenticado")
		return
	}

	user := currentUser.(dao.UserDao)

	c.JSON(http.StatusOK, gin.H{
		"user_name": user.Name,
		"message":   "Bem-vindo de volta, " + user.Name + "!",
	})
}
