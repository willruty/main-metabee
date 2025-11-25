package controller

import (
	"log"
	"metabee/internal/model/dao"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/v2/bson"
)

func Dashboard(c *gin.Context) {
	currentUser, exists := c.Get("currentUser")
	if !exists {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "Usuário não autenticado"})
		log.Println("Usuário nao autenticado")
		return
	}

	user := currentUser.(dao.UserDao)
	userID := user.ID

	// Buscar dados do dashboard
	progressDao := dao.UserProgressDao{}
	courseDao := dao.CourseDao{}
	newsDao := dao.NewsDao{}
	lessonDao := dao.LessonDao{}

	// Cursos ativos
	activeCourses, err := progressDao.GetActiveCourses(userID)
	if err != nil {
		log.Printf("Erro ao buscar cursos ativos: %v", err)
		activeCourses = []dao.UserProgressDao{}
	}

	// Horas estudadas este mês
	hoursThisMonth, err := progressDao.GetHoursThisMonth(userID)
	if err != nil {
		log.Printf("Erro ao buscar horas do mês: %v", err)
		hoursThisMonth = 0
	}

	// Progresso médio
	avgProgress, err := progressDao.GetAverageProgress(userID)
	if err != nil {
		log.Printf("Erro ao buscar progresso médio: %v", err)
		avgProgress = 0
	}

	// Aulas recentes
	recentSessions, err := dao.GetRecentLessons(userID, 5)
	if err != nil {
		log.Printf("Erro ao buscar aulas recentes: %v", err)
		recentSessions = []dao.StudySessionDao{}
	}

	// Buscar detalhes das aulas
	var recentLessons []dao.LessonDao
	if len(recentSessions) > 0 {
		lessonIDs := make([]bson.ObjectID, 0)
		for _, session := range recentSessions {
			if !session.LessonID.IsZero() {
				lessonIDs = append(lessonIDs, session.LessonID)
			}
		}
		if len(lessonIDs) > 0 {
			recentLessons, err = lessonDao.GetLessonsByIDs(lessonIDs)
			if err != nil {
				log.Printf("Erro ao buscar detalhes das aulas: %v", err)
			}
		}
	}

	// Últimas 2 notícias
	lastNews, err := newsDao.GetLastTwoNews()
	if err != nil {
		log.Printf("Erro ao buscar notícias: %v", err)
		lastNews = []dao.NewsDao{}
	}

	// Últimos 2 cursos adicionados
	lastCourses, err := courseDao.GetLastTwoCourses()
	if err != nil {
		log.Printf("Erro ao buscar cursos: %v", err)
		lastCourses = []dao.CourseDao{}
	}

	// Montar resposta
	response := gin.H{
		"user_name":      user.Name,
		"message":        "Bem-vindo de volta, " + user.Name + "!",
		"active_courses": len(activeCourses),
		"hours_this_month": hoursThisMonth,
		"average_progress": avgProgress,
		"recent_lessons":   formatRecentLessons(recentLessons, recentSessions),
		"last_news":        formatNews(lastNews),
		"last_courses":     formatCourses(lastCourses),
	}

	c.JSON(http.StatusOK, response)
}

func formatRecentLessons(lessons []dao.LessonDao, sessions []dao.StudySessionDao) []gin.H {
	result := make([]gin.H, 0)
	
	sessionMap := make(map[bson.ObjectID]dao.StudySessionDao)
	for _, session := range sessions {
		if !session.LessonID.IsZero() {
			sessionMap[session.LessonID] = session
		}
	}

	for _, lesson := range lessons {
		session, exists := sessionMap[lesson.ID]
		item := gin.H{
			"id":          lesson.ID.Hex(),
			"title":       lesson.Title,
			"description": lesson.Description,
			"duration":    lesson.Duration,
		}
		if exists {
			item["last_study"] = session.Date.Format(time.RFC3339)
		}
		result = append(result, item)
	}

	return result
}

func formatNews(news []dao.NewsDao) []gin.H {
	result := make([]gin.H, 0)
	for _, n := range news {
		result = append(result, gin.H{
			"id":        n.ID.Hex(),
			"title":     n.Title,
			"content":   n.Content,
			"image":     n.Image,
			"author":    n.Author,
			"created_at": n.CreatedAt.Format(time.RFC3339),
		})
	}
	return result
}

func formatCourses(courses []dao.CourseDao) []gin.H {
	result := make([]gin.H, 0)
	for _, course := range courses {
		result = append(result, gin.H{
			"id":          course.ID.Hex(),
			"title":       course.Title,
			"description": course.Description,
			"image":       course.Image,
			"category":    course.Category,
			"duration":    course.Duration,
			"created_at":  course.CreatedAt.Format(time.RFC3339),
		})
	}
	return result
}
