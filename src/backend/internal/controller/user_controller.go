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
	"go.mongodb.org/mongo-driver/v2/bson"
)

func Register(c *gin.Context) {
	var input dto.User
	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Validar campos obrigatórios
	if input.Name == "" || input.Email == "" || input.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome, email e senha são obrigatórios"})
		return
	}

	var err error
	user := adapter.UserAdapter{}.DtoToDao(input)
	
	log.Printf("🔐 Registrando novo usuário: %s", input.Email)
	log.Printf("📝 Senha original tem %d caracteres", len(user.Password))
	
	user.Password, err = util.HashPassword(user.Password)
	if err != nil {
		log.Printf("❌ Erro ao hashear a senha: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"erro": "Erro ao hashear a senha"})
		return
	}
	
	log.Printf("✅ Senha hasheada com sucesso (hash tem %d caracteres)", len(user.Password))

	var userDao dao.UserDao
	user, err = userDao.CreateUser(user)
	if err != nil {
		log.Printf("❌ Erro ao criar usuário: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": err.Error()})
		return
	}

	log.Printf("✅ Usuário criado com sucesso: %s (ID: %s)", user.Email, user.ID.Hex())

	token, err := service.GenerateJWT(user.ID.Hex())
	if err != nil {
		log.Println("❌ Erro ao gerar token:", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro interno"})
		return
	}

	log.Printf("✅ Token gerado com sucesso para usuário: %s", user.Email)
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

// GetProfile retorna os dados do perfil do usuário autenticado
func GetProfile(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	
	var userDao dao.UserDao
	profile, err := userDao.GetUserProfile(user.ID)
	if err != nil {
		log.Printf("Erro ao buscar perfil: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfil"})
		return
	}

	// Retornar dados do perfil em snake_case
	c.JSON(http.StatusOK, gin.H{
		"id":        profile.ID.Hex(),
		"name":      profile.Name,
		"email":     profile.Email,
		"bio":       profile.Bio,
		"location":  profile.Location,
		"created_at": profile.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		"updated_at": profile.UpdatedAt.Format("2006-01-02T15:04:05Z07:00"),
		"has_avatar": len(profile.Avatar.Data) > 0,
	})
}

// GetProfileImage retorna a imagem de perfil do usuário
func GetProfileImage(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	
	var userDao dao.UserDao
	profile, err := userDao.GetUserProfile(user.ID)
	if err != nil {
		log.Printf("Erro ao buscar perfil: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar perfil"})
		return
	}

	// Se não tiver avatar, retornar 404
	if len(profile.Avatar.Data) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Avatar não encontrado"})
		return
	}

	// Retornar a imagem
	contentType := profile.AvatarMimeType
	if contentType == "" {
		contentType = "image/jpeg" // Default
	}

	c.Header("Content-Type", contentType)
	c.Header("Cache-Control", "public, max-age=31536000")
	c.Data(http.StatusOK, contentType, profile.Avatar.Data)
}

// UpdateProfile atualiza os dados do perfil do usuário
func UpdateProfile(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)

	var input struct {
		Name     string `json:"name"`
		Bio      string `json:"bio"`
		Location string `json:"location"`
	}

	if err := c.ShouldBindJSON(&input); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos: " + err.Error()})
		return
	}

	// Preparar atualizações
	updates := bson.M{}
	if input.Name != "" {
		updates["name"] = input.Name
	}
	if input.Bio != "" {
		updates["bio"] = input.Bio
	}
	if input.Location != "" {
		updates["location"] = input.Location
	}

	if len(updates) == 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nenhum campo para atualizar"})
		return
	}

	var userDao dao.UserDao
	err := userDao.UpdateUserProfile(user.ID, updates)
	if err != nil {
		log.Printf("Erro ao atualizar perfil: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar perfil"})
		return
	}

	log.Printf("✅ Perfil atualizado com sucesso para usuário: %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "Perfil atualizado com sucesso"})
}

// UpdateProfileImage atualiza a foto de perfil do usuário
func UpdateProfileImage(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)

	// Obter arquivo do formulário
	file, err := c.FormFile("avatar")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Arquivo não encontrado: " + err.Error()})
		return
	}

	// Validar tamanho (máximo 5MB)
	if file.Size > 5*1024*1024 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Arquivo muito grande. Máximo 5MB"})
		return
	}

	// Validar tipo de arquivo
	allowedTypes := map[string]bool{
		"image/jpeg": true,
		"image/jpg":  true,
		"image/png":  true,
		"image/gif":  true,
		"image/webp": true,
	}

	fileHeader, err := file.Open()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao abrir arquivo"})
		return
	}
	defer fileHeader.Close()

	// Ler conteúdo do arquivo
	fileData := make([]byte, file.Size)
	_, err = fileHeader.Read(fileData)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao ler arquivo"})
		return
	}

	// Detectar tipo MIME
	contentType := file.Header.Get("Content-Type")
	if contentType == "" {
		// Tentar detectar pelo conteúdo
		if len(fileData) > 0 {
			if fileData[0] == 0xFF && fileData[1] == 0xD8 {
				contentType = "image/jpeg"
			} else if len(fileData) > 8 && string(fileData[0:8]) == "\x89PNG\r\n\x1a\n" {
				contentType = "image/png"
			} else {
				contentType = "image/jpeg" // Default
			}
		} else {
			contentType = "image/jpeg"
		}
	}

	if !allowedTypes[contentType] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Tipo de arquivo não permitido. Use JPEG, PNG, GIF ou WebP"})
		return
	}

	// Atualizar no banco
	updates := bson.M{
		"avatar":         bson.Binary{Subtype: 0, Data: fileData},
		"avatar_mime_type": contentType,
	}

	var userDao dao.UserDao
	err = userDao.UpdateUserProfile(user.ID, updates)
	if err != nil {
		log.Printf("Erro ao atualizar foto de perfil: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar foto de perfil"})
		return
	}

	log.Printf("✅ Foto de perfil atualizada com sucesso para usuário: %s", user.Email)
	c.JSON(http.StatusOK, gin.H{"message": "Foto de perfil atualizada com sucesso"})
}