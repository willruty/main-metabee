package controller

import (
	"log"
	"metabee/internal/model/dao"
	"net/http"
	"os"
	"path/filepath"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// GetCourseLessons retorna as aulas de um curso baixado localmente
func GetCourseLessons(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	courseID := c.Param("courseId")

	courseObjID, err := bson.ObjectIDFromHex(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do curso inválido"})
		return
	}

	// Verificar se o usuário comprou o curso
	purchaseDao := dao.PurchaseDao{}
	purchase, err := purchaseDao.GetPurchaseByUserAndCourse(user.ID, courseObjID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Curso não comprado ou não encontrado"})
		return
	}

	if purchase.Status != "downloaded" || purchase.LocalPath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Curso não foi baixado ainda"})
		return
	}

	// Buscar arquivos de vídeo na pasta local
	lessons, err := scanVideoFiles(purchase.LocalPath)
	if err != nil {
		log.Printf("Erro ao escanear vídeos: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar vídeos"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"course_id": courseID,
		"lessons":   lessons,
		"local_path": purchase.LocalPath,
	})
}

// GetLessonVideo retorna informações sobre um vídeo específico
func GetLessonVideo(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	courseID := c.Param("courseId")
	lessonFile := c.Param("lessonFile")

	courseObjID, err := bson.ObjectIDFromHex(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do curso inválido"})
		return
	}

	// Verificar se o usuário comprou o curso
	purchaseDao := dao.PurchaseDao{}
	purchase, err := purchaseDao.GetPurchaseByUserAndCourse(user.ID, courseObjID)
	if err != nil {
		c.JSON(http.StatusForbidden, gin.H{"error": "Curso não comprado ou não encontrado"})
		return
	}

	if purchase.Status != "downloaded" || purchase.LocalPath == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Curso não foi baixado ainda"})
		return
	}

	// Construir caminho do arquivo
	videoPath := filepath.Join(purchase.LocalPath, lessonFile)
	
	// Verificar se o arquivo existe
	if _, err := os.Stat(videoPath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "Vídeo não encontrado"})
		return
	}

	// Retornar informações do vídeo (o frontend Electron vai servir o arquivo)
	c.JSON(http.StatusOK, gin.H{
		"file_path": videoPath,
		"file_name": lessonFile,
		"local_path": purchase.LocalPath,
	})
}

// scanVideoFiles escaneia uma pasta e retorna lista de arquivos de vídeo
func scanVideoFiles(localPath string) ([]gin.H, error) {
	lessons := make([]gin.H, 0)

	// Verificar se a pasta existe
	if _, err := os.Stat(localPath); os.IsNotExist(err) {
		return lessons, nil
	}

	// Extensões de vídeo suportadas
	videoExts := map[string]bool{
		".mp4":  true,
		".avi":  true,
		".mkv":  true,
		".mov":  true,
		".webm": true,
	}

	// Ler arquivos da pasta
	files, err := os.ReadDir(localPath)
	if err != nil {
		return nil, err
	}

	order := 1
	for _, file := range files {
		if file.IsDir() {
			continue
		}

		ext := filepath.Ext(file.Name())
		if videoExts[ext] {
			lessons = append(lessons, gin.H{
				"id":       file.Name(),
				"filename": file.Name(),
				"title":    getTitleFromFilename(file.Name()),
				"order":    order,
				"path":     filepath.Join(localPath, file.Name()),
			})
			order++
		}
	}

	return lessons, nil
}

// getTitleFromFilename extrai um título legível do nome do arquivo
func getTitleFromFilename(filename string) string {
	// Remove extensão
	name := filename[:len(filename)-len(filepath.Ext(filename))]
	// Remove números iniciais e underscores/hífens
	// Exemplo: "01_introducao.mp4" -> "Introdução"
	return name
}

