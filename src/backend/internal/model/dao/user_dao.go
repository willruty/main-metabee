package dao

import (
	"context"
	"errors"
	"log"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"golang.org/x/crypto/bcrypt"
)

type UserDao struct {
	ID        primitive.ObjectID `bson:"_id,omitempty"`
	Name      string             `bson:"name"`
	Email     string             `bson:"email"`
	Password  string             `bson:"password"`
	CreatedAt time.Time          `bson:"created_at"`
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

func (dao UserDao) FindUserByEmail(email string) (*UserDao, error) {
	collection := database.DB.Collection(userCollectionName)

	filter := bson.M{"email": email}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user UserDao
	if err := collection.FindOne(ctx, filter).Decode(&user); err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}

func (dao UserDao) CreateUser(name, email, password string) (*UserDao, error) {
	if existingUser, err := dao.FindUserByEmail(email); err != nil {
		return nil, err
	} else if existingUser != nil {
		return nil, errors.New("usuário com este email já existe")
	}

	passwordHash, err := dao.HashPassword(password)
	if err != nil {
		return nil, err
	}

	newUser := UserDao{
		ID:        primitive.NewObjectID(),
		Name:      name,
		Email:     email,
		Password:  passwordHash,
		CreatedAt: time.Now(),
	}

	collection := database.DB.Collection(userCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	result, err := collection.InsertOne(ctx, newUser)
	if err != nil {
		return nil, err
	}

	log.Printf("Novo usuário inserido com sucesso, ID: %s", result.InsertedID)
	return &newUser, nil
}

func (dao *UserDao) FindUserByID(idString string) (*UserDao, error) {
	objID, err := primitive.ObjectIDFromHex(idString)
	if err != nil {
		return nil, errors.New("id de usuário inválido")
	}

	filter := bson.M{"_id": objID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var user UserDao
	err = database.DB.Collection(userCollectionName).FindOne(ctx, filter).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			return nil, nil
		}
		return nil, err
	}

	return &user, nil
}
