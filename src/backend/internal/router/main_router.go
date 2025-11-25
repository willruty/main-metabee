package router

import (
	"log"
	"metabee/internal/controller"
	"metabee/internal/middleware"
	"time"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func configRouter() cors.Config {

	return cors.Config{
		AllowOrigins:     []string{"http://10.154.48.38:5173", "http://localhost:5173"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
		AllowOriginFunc: func(origin string) bool {
			// Permitir requisições sem Origin (como do Electron)
			if origin == "" {
				return true
			}
			// Permitir localhost em qualquer porta
			if len(origin) > 0 && (origin[:10] == "http://127." || origin[:16] == "http://localhost" || origin[:7] == "file://") {
				return true
			}
			return false
		},
	}
}

func SetupMainRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)

	route := gin.New()
	
	// Middleware de debug para logar TODAS as requisições (deve vir primeiro)
	route.Use(func(c *gin.Context) {
		log.Printf("🔍 [ROUTER] Requisição recebida: %s %s | Origin: %s | IP: %s", 
			c.Request.Method, 
			c.Request.URL.Path,
			c.Request.Header.Get("Origin"),
			c.ClientIP())
		c.Next()
		log.Printf("🔍 [ROUTER] Resposta enviada: %s %s - Status: %d", 
			c.Request.Method, 
			c.Request.URL.Path,
			c.Writer.Status())
	})
	
	route.Use(gin.Recovery())
	route.Use(gin.Logger())
	route.Use(cors.New(configRouter()))
	
	// Rota para servir imagens do banco de dados (images/nome-da-img.extensao)
	route.GET("/images/:imageName", controller.GetImageByName)
	
	// Servir arquivos estáticos de imagens (se existirem) - fallback
	route.Static("/images-static", "./images")

	main := route.Group("/metabee")
	{
		// Rotas públicas (sem autenticação)
		main.GET("/health", controller.GetHealth)
		main.POST("/register", controller.Register)
		main.POST("/login", controller.Login)

		// ============================================
		// MARKETPLACE - Rotas Públicas
		// ============================================
		marketplace := main.Group("/marketplace")
		{
			marketplace.GET("/courses", controller.GetAllCourses) // GET /metabee/marketplace/courses
			marketplace.GET("/stats", controller.GetMarketplaceStats) // GET /metabee/marketplace/stats
			marketplace.GET("/courses/:courseId/image", controller.GetCourseImage) // GET /metabee/marketplace/courses/:id/image
		}

		// ============================================
		// NEWS - Rotas Públicas
		// ============================================
		// IMPORTANTE: Rotas mais específicas primeiro para evitar conflitos
		main.GET("/news/last", controller.GetLastNews)              // GET /metabee/news/last
		main.GET("/news/:id/image", controller.GetNewsImage)       // GET /metabee/news/:id/image
		main.GET("/news/:id", controller.GetNewsByID)              // GET /metabee/news/:id
		main.GET("/news", controller.GetAllNews)                   // GET /metabee/news

		// ============================================
		// Rotas Autenticadas
		// ============================================
		// Usuário
		user := main.Group("/user")
		user.Use(middleware.AuthMiddleware)
		{
			user.GET("auth/validate", controller.ValidateToken)
			user.GET("/profile", controller.GetProfile)              // GET /metabee/user/profile
			user.GET("/profile/image", controller.GetProfileImage)   // GET /metabee/user/profile/image
			user.PUT("/profile", controller.UpdateProfile)           // PUT /metabee/user/profile
			user.POST("/profile/image", controller.UpdateProfileImage) // POST /metabee/user/profile/image
		}

		// Dashboard
		dashboard := main.Group("/dashboard")
		dashboard.Use(middleware.AuthMiddleware)
		{
			dashboard.GET("/main", controller.Dashboard)
		}

		// Compras
		purchase := main.Group("/purchase")
		purchase.Use(middleware.AuthMiddleware)
		{
			purchase.POST("/course", controller.PurchaseCourse)
			purchase.GET("/my-courses", controller.GetMyCourses)
			purchase.PUT("/download-status", controller.UpdateDownloadStatus)
		}

		// Cursos (rotas autenticadas)
		coursesAuth := main.Group("/courses")
		coursesAuth.Use(middleware.AuthMiddleware)
		{
			coursesAuth.POST("/:courseId/image", controller.UpdateCourseImage)        // POST /metabee/courses/:id/image - Upload
			coursesAuth.GET("/:courseId/lessons", controller.GetCourseLessons)        // GET /metabee/courses/:id/lessons
			coursesAuth.GET("/:courseId/lesson/:lessonFile", controller.GetLessonVideo) // GET /metabee/courses/:id/lesson/:file
		}

		// Chat IA
		chatIa := main.Group("/chat")
		chatIa.Use(middleware.AuthMiddleware)
		{
			chatIa.POST("/ia", controller.ChatIa)
		}
	}

	return route
}
