package dao

import (
	"context"
	"errors"
	"fmt"
	"log"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"golang.org/x/crypto/bcrypt"
)

type UserDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Name      string             `bson:"name"`
	Email     string             `bson:"email"`
	Password  string             `bson:"password"`
	CreatedAt time.Time          `bson:"created_at"`
}

type LoginInput struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

const userCollectionName = "user"

func (dao UserDao) HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 14)
	return string(bytes), err
}

func (dao UserDao) CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

func (dao UserDao) FindUserByEmail(email string) (UserDao, error) {
	collection := database.DB.Collection(userCollectionName)

	filter := bson.M{"email": email}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user UserDao
	if err := collection.FindOne(ctx, filter).Decode(&user); err != nil {
		return UserDao{}, fmt.Errorf("usuário com email %s nao encontrado", email)
	}

	return user, nil
}

func (dao UserDao) CreateUser(user UserDao) (UserDao, error) {

	var newUser UserDao
	if existingUser, err := dao.FindUserByEmail(user.Email); err != nil {
		// A senha já deve vir hasheada do controller, não fazer hash novamente
		// passwordHash, err := dao.HashPassword(user.Password)
		// if err != nil {
		// 	return UserDao{}, err
		// }

		// Garantir que o ID seja ObjectId explicitamente
		newUserID := bson.NewObjectID()
		log.Printf("Criando novo usuário com ObjectID: %s (tipo: %T)", newUserID.Hex(), newUserID)
		
		newUser = UserDao{
			ID:        newUserID,
			Name:      user.Name,
			Email:     user.Email,
			Password:  user.Password, // Usar a senha já hasheada que veio do controller
			CreatedAt: time.Now(),
		}

		collection := database.DB.Collection(userCollectionName)
		ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()

		// Forçar ObjectId explicitamente usando bson.D para garantir o tipo correto
		doc := bson.D{
			{Key: "_id", Value: newUserID},
			{Key: "name", Value: newUser.Name},
			{Key: "email", Value: newUser.Email},
			{Key: "password", Value: newUser.Password},
			{Key: "created_at", Value: newUser.CreatedAt},
		}

		result, err := collection.InsertOne(ctx, doc)
		if err != nil {
			return UserDao{}, fmt.Errorf("falha ao inserir usuário: %v", err)
		}

		log.Printf("Novo usuário inserido com sucesso, ID inserido: %v (tipo: %T)", result.InsertedID, result.InsertedID)
		
		// Verificar se o ID inserido é ObjectId
		if insertedObjID, ok := result.InsertedID.(bson.ObjectID); ok {
			log.Printf("✅ ID confirmado como ObjectID: %s", insertedObjID.Hex())
		} else {
			log.Printf("⚠️  ATENÇÃO: ID inserido não é ObjectID! Tipo: %T, Valor: %v", result.InsertedID, result.InsertedID)
		}
	} else if existingUser != dao {
		return UserDao{}, errors.New("usuário com este email já existe")
	}

	return newUser, nil
}

func (dao *UserDao) FindUserByID(idString string) (UserDao, error) {
	objID, err := bson.ObjectIDFromHex(idString)
	if err != nil {
		return UserDao{}, errors.New("id de usuário inválido")
	}

	filter := bson.M{"_id": objID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user UserDao
	err = database.DB.Collection(userCollectionName).FindOne(ctx, filter).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return UserDao{}, nil
		}
		return UserDao{}, err
	}

	return user, nil
}
