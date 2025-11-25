package controller

import (
	"log"
	"metabee/internal/adapter"
	"metabee/internal/model/dao"
	"metabee/internal/service"
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

type LoginOutput struct {
	AccessToken  string `json:"access_token"`
	RefreshToken string `json:"refresh_token"`
	UserID       string `json:"user_id"`
}

func Login(c *gin.Context) {
	var input dao.LoginInput
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Dados inválidos: " + err.Error()})
		return
	}

	// Validar campos obrigatórios
	if input.Email == "" || input.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email e senha são obrigatórios"})
		return
	}

	// Normalizar email (trim e lowercase)
	originalEmail := input.Email
	input.Email = strings.TrimSpace(strings.ToLower(input.Email))
	log.Printf("🔐 Tentativa de login - Email original: '%s', normalizado: '%s'", originalEmail, input.Email)
	log.Printf("🔐 Senha recebida tem %d caracteres", len(input.Password))

	userDto := adapter.UserAdapter{}.LoginInputToDao(input)

	var userDao dao.UserDao
	user, err := userDao.FindUserByEmail(userDto.Email)
	if err != nil {
		log.Printf("❌ Erro ao buscar usuário por email '%s': %v", userDto.Email, err)
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	log.Printf("✅ Usuário encontrado: email='%s', ID='%s'", user.Email, user.ID.Hex())
	log.Printf("🔍 Verificando senha... (hash no banco tem %d caracteres)", len(user.Password))
	
	if user.Password == "" {
		log.Printf("❌ Hash de senha vazio no banco de dados!")
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Problema na senha do usuário. Contate o suporte."})
		return
	}

	// Verificar se a senha está correta
	log.Printf("🔍 Comparando senha fornecida com hash do banco...")
	if !userDao.CheckPasswordHash(input.Password, user.Password) {
		log.Printf("❌ Senha incorreta para usuário: %s", user.Email)
		c.JSON(http.StatusBadRequest, gin.H{"erro": "Email ou senha inválidos"})
		return
	}

	log.Printf("✅ Senha verificada com sucesso para usuário: %s", user.Email)

	token, err := service.GenerateJWT(user.ID.Hex())
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao gerar token"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": token,
	})
}
