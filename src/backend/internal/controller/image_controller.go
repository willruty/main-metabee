package controller

import (
	"context"
	"io"
	"log"
	"metabee/internal/database"
	"metabee/internal/model/dao"
	"net/http"
	"path/filepath"
	"strings"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// GetCourseImage retorna a imagem de um curso
func GetCourseImage(c *gin.Context) {
	courseID := c.Param("courseId")
	log.Printf("GET /metabee/courses/%s/image - Requisição recebida", courseID)

	objID, err := bson.ObjectIDFromHex(courseID)
	if err != nil {
		log.Printf("ID inválido: %s - %v", courseID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do curso inválido"})
		return
	}

	var courseDao dao.CourseDao
	course, err := courseDao.FindByID(objID)
	if err != nil {
		log.Printf("Curso não encontrado: %s - %v", courseID, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Curso não encontrado"})
		return
	}

	// Se tem ImageData (binário), servir ele
	if len(course.ImageData.Data) > 0 {
		contentType := course.ImageType
		if contentType == "" {
			contentType = "image/jpeg" // padrão
		}

		c.Header("Content-Type", contentType)
		c.Header("Cache-Control", "public, max-age=31536000") // Cache de 1 ano
		c.Data(http.StatusOK, contentType, course.ImageData.Data)
		return
	}

	// Se não tem ImageData mas tem um caminho de imagem, redirecionar para o caminho
	if course.Image != "" {
		// Se o caminho começa com /, é um caminho relativo - redirecionar
		if course.Image[0] == '/' {
			c.Redirect(http.StatusFound, course.Image)
			return
		}
		// Se for uma URL completa, redirecionar
		if len(course.Image) > 7 && (course.Image[:7] == "http://" || course.Image[:8] == "https://") {
			c.Redirect(http.StatusFound, course.Image)
			return
		}
	}

	// Se não tem ImageData nem caminho válido, retornar 404
	c.JSON(http.StatusNotFound, gin.H{"error": "Imagem não encontrada"})
}

// UpdateCourseImage atualiza a imagem de um curso
func UpdateCourseImage(c *gin.Context) {
	courseID := c.Param("courseId")

	objID, err := bson.ObjectIDFromHex(courseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do curso inválido"})
		return
	}

	// Ler o arquivo enviado
	file, header, err := c.Request.FormFile("image")
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Arquivo de imagem não fornecido"})
		return
	}
	defer file.Close()

	// Ler os bytes da imagem
	imageData, err := io.ReadAll(file)
	if err != nil {
		log.Printf("Erro ao ler imagem: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar imagem"})
		return
	}

	// Determinar o tipo MIME
	contentType := header.Header.Get("Content-Type")
	if contentType == "" {
		// Tentar detectar pelo nome do arquivo
		filename := header.Filename
		if len(filename) > 4 {
			ext := filename[len(filename)-4:]
			switch ext {
			case ".jpg", ".jpeg":
				contentType = "image/jpeg"
			case ".png":
				contentType = "image/png"
			case ".gif":
				contentType = "image/gif"
			case "webp":
				contentType = "image/webp"
			default:
				contentType = "image/jpeg" // padrão
			}
		}
	}

	// Criar Binary do MongoDB
	binaryData := bson.Binary{
		Subtype: 0, // Generic binary subtype
		Data:    imageData,
	}

	// Atualizar o curso no banco
	collection := database.DB.Collection("courses")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"image_data": binaryData,
			"image_type": contentType,
			"updated_at": time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": objID}, update)
	if err != nil {
		log.Printf("Erro ao atualizar imagem: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao salvar imagem"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Curso não encontrado"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":    "Imagem atualizada com sucesso",
		"size":       len(imageData),
		"content_type": contentType,
	})
}

// GetImageByName serve uma imagem pelo nome (images/nome-da-img.extensao)
func GetImageByName(c *gin.Context) {
	imageName := c.Param("imageName")
	log.Printf("GET /images/%s - Requisição recebida", imageName)

	if imageName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Nome da imagem não fornecido"})
		return
	}

	var imageDao dao.ImageDao
	image, err := imageDao.FindImageByName(imageName)
	if err != nil {
		log.Printf("Imagem não encontrada: %s - %v", imageName, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Imagem não encontrada"})
		return
	}

	// Determinar Content-Type baseado no nome do arquivo se não tiver mime_type
	contentType := image.MimeType
	if contentType == "" {
		ext := strings.ToLower(filepath.Ext(imageName))
		switch ext {
		case ".jpg", ".jpeg":
			contentType = "image/jpeg"
		case ".png":
			contentType = "image/png"
		case ".gif":
			contentType = "image/gif"
		case ".webp":
			contentType = "image/webp"
		case ".svg":
			contentType = "image/svg+xml"
		default:
			contentType = "image/jpeg" // padrão
		}
	}

	c.Header("Content-Type", contentType)
	c.Header("Cache-Control", "public, max-age=31536000") // Cache de 1 ano
	c.Data(http.StatusOK, contentType, image.Data.Data)
}

// GetNewsImage retorna a imagem de uma notícia
func GetNewsImage(c *gin.Context) {
	newsID := c.Param("id")
	log.Printf("GET /metabee/news/%s/image - Requisição recebida", newsID)

	objID, err := bson.ObjectIDFromHex(newsID)
	if err != nil {
		log.Printf("ID inválido: %s - %v", newsID, err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da notícia inválido"})
		return
	}

	var newsDao dao.NewsDao
	news, err := newsDao.FindByID(objID)
	if err != nil {
		log.Printf("Notícia não encontrada: %s - %v", newsID, err)
		c.JSON(http.StatusNotFound, gin.H{"error": "Notícia não encontrada"})
		return
	}

	// 1. Se ImageID está presente, buscar da collection images
	if !news.ImageID.IsZero() {
		var imageDao dao.ImageDao
		image, err := imageDao.FindImageByID(news.ImageID)
		if err == nil && len(image.Data.Data) > 0 {
			contentType := image.MimeType
			if contentType == "" {
				contentType = "image/jpeg"
			}
			c.Header("Content-Type", contentType)
			c.Header("Cache-Control", "public, max-age=31536000")
			c.Data(http.StatusOK, contentType, image.Data.Data)
			return
		}
	}

	// 2. Se Image (string path/URL) está presente, redirecionar
	if news.Image != "" {
		if news.Image[0] == '/' {
			c.Redirect(http.StatusFound, news.Image)
			return
		}
		if len(news.Image) > 7 && (news.Image[:7] == "http://" || news.Image[:8] == "https://") {
			c.Redirect(http.StatusFound, news.Image)
			return
		}
		// Se for apenas o nome do arquivo, redirecionar para /images/
		c.Redirect(http.StatusFound, "/images/"+news.Image)
		return
	}

	c.JSON(http.StatusNotFound, gin.H{"error": "Imagem não encontrada"})
}

