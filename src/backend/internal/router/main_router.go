package router

import (
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
		AllowHeaders:     []string{"Origin", "Content-Type", "Authorization"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
		MaxAge:           12 * time.Hour,
	}
}

func SetupMainRouter() *gin.Engine {

	gin.SetMode(gin.DebugMode)

	route := gin.New()
	route.Use(gin.Recovery())
	route.Use(gin.Logger())
	route.Use(cors.New(configRouter()))

	main := route.Group("/metabee")
	{
		main.GET("/health", controller.GetHealth)
		main.POST("/register", controller.Register)
		main.POST("/login", controller.Login)

		user := main.Group("/user")
		user.Use(middleware.AuthMiddleware)
		{
			user.GET("auth/validate", controller.ValidateToken)
		}

		dashboard := main.Group("/dashboard")
		{
			dashboard.GET("/name", middleware.AuthMiddleware, controller.Dashboard)
		}

		chatIa := main.Group("/chat")
		{
			chatIa.POST("/ia", controller.ChatIa)
		}
	}

	return route
}
