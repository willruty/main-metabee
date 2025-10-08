package main

import (
	"log"
	"metabee/internal/config"
	"metabee/internal/database"
	"metabee/internal/router"
	"strconv"
)

func main() {

	config.Load()
	if err := database.DBConnect(); err != nil {
		log.Println(err)
	}
	port := strconv.Itoa(config.Env.Service.Port)

	r := router.SetupMainRouter()
	r.Run(":" + port)
}
