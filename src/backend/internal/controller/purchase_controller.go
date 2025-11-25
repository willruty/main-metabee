package controller

import (
	"log"
	"metabee/internal/model/dao"
	"net/http"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

type PurchaseRequest struct {
	CourseID string `json:"course_id" binding:"required"`
}

type PurchaseResponse struct {
	PurchaseID string `json:"purchase_id"`
	DriveLink  string `json:"drive_link"`
	Status     string `json:"status"`
	Message    string `json:"message"`
}

// PurchaseCourse cria uma compra de curso
func PurchaseCourse(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	var req PurchaseRequest

	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "course_id é obrigatório"})
		return
	}

	courseID, err := bson.ObjectIDFromHex(req.CourseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID do curso inválido"})
		return
	}

	// Buscar o curso para pegar o link do Drive
	courseDao := dao.CourseDao{}
	course, err := courseDao.FindByID(courseID)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Curso não encontrado"})
		return
	}

	// Verificar se o usuário já comprou este curso
	purchaseDao := dao.PurchaseDao{}
	existingPurchase, err := purchaseDao.GetPurchaseByUserAndCourse(user.ID, courseID)
	if err == nil && existingPurchase.ID.Hex() != "" {
		c.JSON(http.StatusOK, PurchaseResponse{
			PurchaseID: existingPurchase.ID.Hex(),
			DriveLink:  existingPurchase.DriveLink,
			Status:     existingPurchase.Status,
			Message:    "Curso já comprado",
		})
		return
	}

	// Criar a compra com o link do Drive do curso
	purchase, err := purchaseDao.CreatePurchase(user.ID, courseID, course.DriveLink)
	if err != nil {
		log.Printf("Erro ao criar compra: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao processar compra"})
		return
	}

	c.JSON(http.StatusOK, PurchaseResponse{
		PurchaseID: purchase.ID.Hex(),
		DriveLink:  purchase.DriveLink,
		Status:     purchase.Status,
		Message:    "Compra realizada com sucesso. Inicie o download do curso.",
	})
}

// GetMyCourses retorna os cursos comprados pelo usuário
func GetMyCourses(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	user := currentUser.(dao.UserDao)
	purchaseDao := dao.PurchaseDao{}

	purchases, err := purchaseDao.GetPurchasesByUser(user.ID)
	if err != nil {
		log.Printf("Erro ao buscar compras: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao buscar cursos"})
		return
	}

	// Buscar detalhes dos cursos
	courseDao := dao.CourseDao{}
	courses := make([]gin.H, 0)

	for _, purchase := range purchases {
		course, err := courseDao.FindByID(purchase.CourseID)
		if err != nil {
			log.Printf("Erro ao buscar curso %s: %v", purchase.CourseID.Hex(), err)
			continue
		}

		courses = append(courses, gin.H{
			"purchase_id": purchase.ID.Hex(),
			"course_id":    purchase.CourseID.Hex(),
			"title":        course.Title,
			"description":  course.Description,
			"image":        course.Image,
			"category":     course.Category,
			"duration":     course.Duration,
			"status":       purchase.Status,
			"drive_link":   purchase.DriveLink,
			"local_path":   purchase.LocalPath,
			"created_at":   purchase.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, gin.H{
		"courses": courses,
	})
}

// UpdateDownloadStatus atualiza o status do download
func UpdateDownloadStatus(c *gin.Context) {
	_, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		return
	}

	type UpdateRequest struct {
		PurchaseID string `json:"purchase_id" binding:"required"`
		Status     string `json:"status" binding:"required"` // "downloading", "downloaded", "error"
		LocalPath  string `json:"local_path,omitempty"`
	}

	var req UpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Dados inválidos"})
		return
	}

	purchaseID, err := bson.ObjectIDFromHex(req.PurchaseID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ID da compra inválido"})
		return
	}

	purchaseDao := dao.PurchaseDao{}
	err = purchaseDao.UpdatePurchaseStatus(purchaseID, req.Status, req.LocalPath)
	if err != nil {
		log.Printf("Erro ao atualizar status: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Erro ao atualizar status"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Status atualizado com sucesso"})
}

