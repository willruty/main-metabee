package database

import (
	"context"
	"log"
	"time"

	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

var MongoClient *mongo.Client
var DB *mongo.Database

func ConnectMongoDB() {
	clientOptions := options.Client().ApplyURI("mongodb+srv://will:Threads2025@metabee.jysotwt.mongodb.net/?retryWrites=true&w=majority&appName=Metabee")

	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(clientOptions)
	if err != nil {
		log.Fatal(err)
	}

	err = client.Ping(ctx, nil)
	if err != nil {
		log.Fatal("Erro ao conectar no MongoDB:", err)
	}

	log.Println("✅ Conectado ao MongoDB com sucesso")
	db := client.Database("metabee_db")
	DB = db
}
