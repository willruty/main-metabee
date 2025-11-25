package controller

import (
	"context"
	"log"
	"metabee/internal/database"
	"metabee/internal/model/dao"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

// GetAllCourses retorna todos os cursos disponíveis
func GetAllCourses(c *gin.Context) {
	log.Printf("✅ GET /metabee/marketplace/courses - Requisição recebida")
	log.Printf("   Path: %s, Method: %s, IP: %s", c.Request.URL.Path, c.Request.Method, c.ClientIP())
	
	var courseDao dao.CourseDao

	courses, err := courseDao.GetAllCourses()
	if err != nil {
		log.Printf("Erro ao buscar cursos: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar cursos", "details": err.Error()})
		return
	}

	log.Printf("GET /metabee/courses - Retornando %d cursos", len(courses))
	c.JSON(http.StatusOK, gin.H{
		"courses": courses,
	})
}

// GetMarketplaceStats retorna estatísticas do marketplace
func GetMarketplaceStats(c *gin.Context) {
	log.Printf("✅ GET /metabee/marketplace/stats - Requisição recebida")
	log.Printf("   Path: %s, Method: %s, IP: %s", c.Request.URL.Path, c.Request.Method, c.ClientIP())
	
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Contar total de cursos
	var courseDao dao.CourseDao
	courses, err := courseDao.GetAllCourses()
	if err != nil {
		log.Printf("Erro ao buscar cursos para estatísticas: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar estatísticas"})
		return
	}
	totalCourses := len(courses)

	// Calcular média de notas (grade) dos cursos
	// Soma todas as notas e divide pelo número de cursos com nota
	averageRating := 0.0
	totalGrade := 0.0
	coursesWithGrade := 0
	
	for _, course := range courses {
		if course.Grade > 0 {
			totalGrade += course.Grade
			coursesWithGrade++
		}
	}
	
	if coursesWithGrade > 0 {
		averageRating = totalGrade / float64(coursesWithGrade)
	}

	// Contar total de usuários na collection "user"
	userCollection := database.DB.Collection("user")
	totalUsersCount, err := userCollection.CountDocuments(ctx, bson.M{})
	totalUsers := int64(0)
	if err != nil {
		log.Printf("Erro ao contar usuários: %v", err)
	} else {
		totalUsers = totalUsersCount
	}

	// Total de estudantes é o mesmo que total de usuários (todos os registros na collection "user")
	totalStudents := int(totalUsers)

	c.JSON(http.StatusOK, gin.H{
		"total_courses":   totalCourses,
		"average_rating":  averageRating,
		"total_students":  totalStudents,
		"total_users":     int(totalUsers),
	})
}

