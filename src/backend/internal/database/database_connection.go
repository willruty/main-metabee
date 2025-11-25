package database

import (
	"context"
	"log"
	"metabee/internal/config"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var MongoClient *mongo.Client
var DB *mongo.Database

func ConnectMongoDB() {
	mongoURI := config.Env.Database.MongoURI
	if mongoURI == "" {
		log.Fatal("MongoDB URI não configurada. Verifique o arquivo metabee.conf")
	}

	clientOptions := options.Client().ApplyURI(mongoURI)

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatal("Erro ao conectar no MongoDB:", err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Erro ao fazer ping no MongoDB:", err)
	}

	MongoClient = client
	dbName := config.Env.Database.DBName
	if dbName == "" {
		dbName = "metabee_db"
	}
	DB = client.Database(dbName)

	log.Println("✅ Conectado ao MongoDB com sucesso")
}
