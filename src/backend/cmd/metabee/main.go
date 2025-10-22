package main

import (
	"metabee/internal/config"
	"metabee/internal/database"
	"metabee/internal/router"
	"strconv"
)

func main() {

	config.Load()
	database.ConnectMongoDB()

	port := strconv.Itoa(config.Env.Service.Port)

	r := router.SetupMainRouter()
	r.Run(":" + port)
}
