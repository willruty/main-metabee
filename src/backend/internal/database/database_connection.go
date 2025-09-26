package database

import (
	"fmt"
	"log"
	"metabee/internal/config"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func DatabaseConnect() {

	HOST := config.Env.Database.Host
	PORT := config.Env.Database.Port
	USER := config.Env.Database.User
	PASSWORD := config.Env.Database.Password
	DBNAME := config.Env.Database.DatabaseName

	// Monta a DSN com as variáveis
	dsn := fmt.Sprintf(
		"host=%s port=%d user=%s password=%s dbname=%s sslmode=disable",
		HOST, PORT, USER, PASSWORD, DBNAME,
	)

	// Abre conexão com Gorm moderno
	db, err := gorm.Open(postgres.Open(dsn), &gorm.Config{})
	if err != nil {
		log.Fatalf("Erro ao conectar ao banco: %v", err)
	}

	DB = db
	log.Println("Conexão com banco estabelecida com sucesso!")
}
