package controller

import (
	"log"
	"metabee/internal/model/dao"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// GetAllNews retorna todas as notícias disponíveis
func GetAllNews(c *gin.Context) {
	log.Printf("✅ GET /metabee/news - Requisição recebida")
	log.Printf("   Path: %s, Method: %s, IP: %s", c.Request.URL.Path, c.Request.Method, c.ClientIP())
	
	var newsDao dao.NewsDao

	news, err := newsDao.GetAllNews()
	if err != nil {
		log.Printf("Erro ao buscar notícias: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar notícias", "details": err.Error()})
		return
	}

	log.Printf("GET /metabee/news - Retornando %d notícias", len(news))
	c.JSON(http.StatusOK, gin.H{
		"news": news,
	})
}

// GetNewsByID retorna uma notícia específica por ID
func GetNewsByID(c *gin.Context) {
	newsID := c.Param("id")
	log.Printf("✅ GET /metabee/news/%s - Requisição recebida", newsID)

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

	c.JSON(http.StatusOK, gin.H{
		"news": news,
	})
}

// GetLastNews retorna as últimas notícias
func GetLastNews(c *gin.Context) {
	log.Printf("✅ GET /metabee/news/last - Requisição recebida")
	
	var newsDao dao.NewsDao
	limit := 5 // Padrão: 5 últimas notícias

	news, err := newsDao.GetLastNews(limit)
	if err != nil {
		log.Printf("Erro ao buscar últimas notícias: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar notícias"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"news": news,
	})
}

