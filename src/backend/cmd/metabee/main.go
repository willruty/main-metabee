package main

import (
	"log"
	"metabee/internal/config"
	"metabee/internal/database"
	"metabee/internal/router"
	"strconv"

	"github.com/gin-gonic/gin"
)

func main() {
	config.Load()
	database.ConnectMongoDB()

	port := strconv.Itoa(config.Env.Service.Port)

	r := router.SetupMainRouter()
	
	if gin.Mode() == gin.DebugMode {
		log.Println("📋 Rotas registradas:")
		for _, route := range r.Routes() {
			log.Printf("   %s %s", route.Method, route.Path)
		}
	}
	
	log.Printf("🚀 Servidor iniciado na porta %s", port)
	r.Run(":" + port)
}
