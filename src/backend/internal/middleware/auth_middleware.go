package middleware

import (
	"log"
	"metabee/internal/model/dao"
	"metabee/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware(c *gin.Context) {

	authHeader := c.GetHeader("Authorization")
	if !strings.HasPrefix(authHeader, "Bearer ") {
		log.Printf("❌ AuthMiddleware: Token não fornecido ou formato inválido")
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token não fornecido"})
		return
	}
	
	token := strings.TrimPrefix(authHeader, "Bearer ")
	log.Printf("🔍 AuthMiddleware: Token recebido (length: %d)", len(token))
	
	userId, err := service.ValidateJWT(token)
	if err != nil {
		log.Printf("❌ AuthMiddleware: Erro ao validar token - %v", err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Token inválido"})
		return
	}
	
	log.Printf("✅ AuthMiddleware: Token válido - UserID: %s", userId)
	
	userDao := dao.UserDao{}
	loggedInUser, err := userDao.FindUserByID(userId)
	if err != nil {
		log.Printf("❌ AuthMiddleware: Erro ao buscar usuário - UserID: %s - Erro: %v", userId, err)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Erro ao verificar usuário"})
		return
	}
	
	if loggedInUser.Email == "" {
		log.Printf("❌ AuthMiddleware: Usuário encontrado mas sem email - UserID: %s", userId)
		c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "Usuário não encontrado"})
		return
	}

	log.Printf("✅ AuthMiddleware: Usuário autenticado com sucesso - Email: %s", loggedInUser.Email)
	c.Set("currentUser", loggedInUser)
	c.Next()
}
