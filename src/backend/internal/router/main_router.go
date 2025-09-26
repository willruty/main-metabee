package router

import (
	"metabee/internal/controller"
	"metabee/internal/middleware"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func configRouter() cors.Config {
	config := cors.DefaultConfig()
	config.AllowOrigins = []string{"http://localhost:5173"}
	config.AllowMethods = []string{"POST", "GET", "DELETE", "PUT"}
	config.AllowHeaders = []string{"Origin", "Content-Type", "Authorization"}
	config.ExposeHeaders = []string{"Origin", "Content-Type"}
	config.AllowCredentials = true
	return config
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
	}

	return route
}
