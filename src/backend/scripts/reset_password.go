package main

import (
	"context"
	"fmt"
	"log"
	"metabee/internal/config"
	"metabee/internal/database"
	"metabee/internal/util"
	"os"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
)

func main() {
	if len(os.Args) < 3 {
		fmt.Println("Uso: go run reset_password.go <email> <nova_senha>")
		os.Exit(1)
	}

	email := os.Args[1]
	newPassword := os.Args[2]

	// Carregar configurações
	config.Load()

	// Conectar ao banco
	database.ConnectMongoDB()
	defer func() {
		if database.MongoClient != nil {
			ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
			defer cancel()
			database.MongoClient.Disconnect(ctx)
		}
	}()

	// Hashear a nova senha
	hashedPassword, err := util.HashPassword(newPassword)
	if err != nil {
		log.Fatalf("Erro ao hashear senha: %v", err)
	}

	// Buscar usuário por email
	collection := database.DB.Collection("user")
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Normalizar email para busca
	normalizedEmail := email
	filter := bson.M{"email": bson.M{"$regex": "^" + normalizedEmail + "$", "$options": "i"}}
	
	var user bson.M
	err = collection.FindOne(ctx, filter).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Fatalf("Usuário com email %s não encontrado", email)
		}
		log.Fatalf("Erro ao buscar usuário: %v", err)
	}

	// Atualizar senha
	update := bson.M{
		"$set": bson.M{
			"password":  hashedPassword,
			"updated_at": time.Now(),
		},
	}

	result, err := collection.UpdateOne(ctx, filter, update)
	if err != nil {
		log.Fatalf("Erro ao atualizar senha: %v", err)
	}

	if result.MatchedCount == 0 {
		log.Fatalf("Nenhum usuário foi atualizado")
	}

	fmt.Printf("✅ Senha atualizada com sucesso para o usuário: %s\n", email)
	fmt.Printf("   Nova senha (hasheada): %s\n", hashedPassword[:20]+"...")
}

