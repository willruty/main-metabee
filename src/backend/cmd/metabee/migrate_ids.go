package main

import (
	"context"
	"log"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

func migrateIDs() {
	log.Println("🔄 Iniciando migração de IDs...")

	// Migrar usuários
	if err := migrateCollection("user", "_id"); err != nil {
		log.Printf("❌ Erro ao migrar user: %v", err)
	} else {
		log.Println("✅ Usuários migrados")
	}

	// Migrar cursos
	if err := migrateCollection("courses", "_id"); err != nil {
		log.Printf("❌ Erro ao migrar courses: %v", err)
	} else {
		log.Println("✅ Cursos migrados")
	}

	// Migrar compras
	if err := migrateCollection("purchase", "_id"); err != nil {
		log.Printf("❌ Erro ao migrar purchase: %v", err)
	} else {
		log.Println("✅ Compras migradas")
	}

	// Migrar referências em purchase
	if err := migrateReferences("purchase", "user_id"); err != nil {
		log.Printf("❌ Erro ao migrar user_id em purchase: %v", err)
	} else {
		log.Println("✅ Referências user_id migradas")
	}

	if err := migrateReferences("purchase", "course_id"); err != nil {
		log.Printf("❌ Erro ao migrar course_id em purchase: %v", err)
	} else {
		log.Println("✅ Referências course_id migradas")
	}

	log.Println("✅ Migração concluída!")
}

func migrateCollection(collectionName, fieldName string) error {
	collection := database.DB.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	// Buscar todos os documentos
	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	var migrated int
	for cursor.Next(ctx) {
		var doc bson.M
		if err := cursor.Decode(&doc); err != nil {
			log.Printf("Erro ao decodificar documento: %v", err)
			continue
		}

		// Verificar se o _id é Binary
		idValue := doc[fieldName]
		if idValue == nil {
			continue
		}

		// Tentar converter para ObjectID
		var newID bson.ObjectID
		var needsUpdate bool

		switch v := idValue.(type) {
		case bson.ObjectID:
			// Já é ObjectID, pular
			continue
		case bson.Binary:
			// Converter Binary para ObjectID
			if len(v.Data) == 12 {
				copy(newID[:], v.Data)
				needsUpdate = true
			} else {
				log.Printf("Binary ID com tamanho inválido: %d", len(v.Data))
				continue
			}
		case string:
			// Tentar converter string para ObjectID
			objID, err := bson.ObjectIDFromHex(v)
			if err != nil {
				log.Printf("Erro ao converter string para ObjectID: %v", err)
				continue
			}
			newID = objID
			needsUpdate = true
		default:
			log.Printf("Tipo de ID não suportado: %T", v)
			continue
		}

		if needsUpdate {
			// Atualizar o documento
			filter := bson.M{fieldName: idValue}
			update := bson.M{"$set": bson.M{fieldName: newID}}

			result, err := collection.UpdateOne(ctx, filter, update)
			if err != nil {
				log.Printf("Erro ao atualizar documento: %v", err)
				continue
			}

			if result.ModifiedCount > 0 {
				migrated++
			}
		}
	}

	log.Printf("📊 %d documentos migrados na coleção %s", migrated, collectionName)
	return nil
}

func migrateReferences(collectionName, fieldName string) error {
	collection := database.DB.Collection(collectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return err
	}
	defer cursor.Close(ctx)

	var migrated int
	for cursor.Next(ctx) {
		var doc bson.M
		if err := cursor.Decode(&doc); err != nil {
			continue
		}

		refValue := doc[fieldName]
		if refValue == nil {
			continue
		}

		var newRef bson.ObjectID
		var needsUpdate bool

		switch v := refValue.(type) {
		case bson.ObjectID:
			continue
		case bson.Binary:
			if len(v.Data) == 12 {
				copy(newRef[:], v.Data)
				needsUpdate = true
			}
		case string:
			objID, err := bson.ObjectIDFromHex(v)
			if err != nil {
				continue
			}
			newRef = objID
			needsUpdate = true
		default:
			continue
		}

		if needsUpdate {
			filter := bson.M{"_id": doc["_id"]}
			update := bson.M{"$set": bson.M{fieldName: newRef}}

			result, err := collection.UpdateOne(ctx, filter, update)
			if err != nil {
				continue
			}

			if result.ModifiedCount > 0 {
				migrated++
			}
		}
	}

	log.Printf("📊 %d referências %s migradas na coleção %s", migrated, fieldName, collectionName)
	return nil
}
