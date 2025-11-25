package dao

import (
	"context"
	"errors"
	"fmt"
	"log"
	"metabee/internal/database"
	"regexp"
	"strings"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
	"golang.org/x/crypto/bcrypt"
)

type UserDao struct {
	ID             bson.ObjectID `bson:"_id,omitempty"`
	Name           string        `bson:"name"`
	Email          string        `bson:"email"`
	Password       string        `bson:"password"`
	Bio            string        `bson:"bio,omitempty"`         // Biografia do usuário
	Location       string        `bson:"location,omitempty"`    // Local onde reside
	Avatar         bson.Binary   `bson:"avatar,omitempty"`      // Foto de perfil (binário)
	AvatarMimeType string        `bson:"avatar_mime_type,omitempty"` // Tipo MIME da imagem
	CreatedAt      time.Time     `bson:"created_at"`
	UpdatedAt      time.Time     `bson:"updated_at,omitempty"`
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
	if hash == "" {
		return false
	}
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	if err != nil {
		log.Printf("❌ Erro ao comparar senha: %v (hash length: %d, password length: %d)", err, len(hash), len(password))
		return false
	}
	return true
}

func (dao UserDao) FindUserByEmail(email string) (UserDao, error) {
	collection := database.DB.Collection(userCollectionName)

	// Normalizar email: trim e lowercase
	normalizedEmail := strings.TrimSpace(strings.ToLower(email))
	
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	log.Printf("🔍 Buscando usuário com email: '%s' (normalizado: '%s')", email, normalizedEmail)

	var user UserDao
	
	// Primeiro tentar busca exata (case-insensitive com regex)
	escapedEmail := regexp.QuoteMeta(normalizedEmail)
	filter := bson.M{"email": bson.M{"$regex": "^" + escapedEmail + "$", "$options": "i"}}
	
	// Usar projection para excluir o campo avatar se causar problemas
	opts := options.FindOne().SetProjection(bson.M{
		"avatar": 0, // Excluir avatar da busca para evitar problemas de decodificação
	})
	
	err := collection.FindOne(ctx, filter, opts).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			// Se não encontrou, tentar busca sem normalização (pode ter sido salvo com maiúsculas)
			log.Printf("⚠️  Busca normalizada falhou, tentando busca direta...")
			filter2 := bson.M{"email": email}
			err2 := collection.FindOne(ctx, filter2, opts).Decode(&user)
			if err2 != nil {
				log.Printf("❌ Usuário não encontrado. Email buscado: '%s' (normalizado: '%s')", email, normalizedEmail)
				return UserDao{}, fmt.Errorf("usuário com email %s não encontrado", email)
			}
		} else {
			log.Printf("❌ Erro ao buscar usuário: %v", err)
			return UserDao{}, fmt.Errorf("erro ao buscar usuário: %v", err)
		}
	}

	log.Printf("✅ Usuário encontrado: email no banco='%s', email buscado='%s'", user.Email, normalizedEmail)
	return user, nil
}

func (dao UserDao) CreateUser(user UserDao) (UserDao, error) {
	// Verificar se o usuário já existe
	_, err := dao.FindUserByEmail(user.Email)
	if err == nil {
		// Se não retornou erro, significa que encontrou um usuário
		return UserDao{}, errors.New("usuário com este email já existe")
	}

	// A senha já deve vir hasheada do controller, não fazer hash novamente
	// Garantir que o ID seja ObjectId explicitamente
	newUserID := bson.NewObjectID()
	log.Printf("Criando novo usuário com ObjectID: %s (tipo: %T)", newUserID.Hex(), newUserID)
	
	newUser := UserDao{
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

	return newUser, nil
}

func (dao *UserDao) FindUserByID(idString string) (UserDao, error) {
	objID, err := bson.ObjectIDFromHex(idString)
	if err != nil {
		log.Printf("❌ Erro ao converter ID para ObjectID: %s - %v", idString, err)
		return UserDao{}, errors.New("id de usuário inválido")
	}

	filter := bson.M{"_id": objID}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	collection := database.DB.Collection(userCollectionName)
	
	// Usar projection para excluir o campo avatar se causar problemas de decodificação
	opts := options.FindOne().SetProjection(bson.M{
		"avatar": 0, // Excluir avatar da busca para evitar problemas de decodificação
	})

	var user UserDao
	err = collection.FindOne(ctx, filter, opts).Decode(&user)

	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("❌ Usuário não encontrado com ID: %s", idString)
			return UserDao{}, errors.New("usuário não encontrado")
		}
		log.Printf("❌ Erro ao buscar usuário por ID: %s - %v", idString, err)
		return UserDao{}, fmt.Errorf("erro ao buscar usuário: %v", err)
	}

	log.Printf("✅ Usuário encontrado por ID: %s - Email: %s", idString, user.Email)
	return user, nil
}

// HasAvatar verifica se o usuário tem avatar sem decodificar o binário
func (dao *UserDao) HasAvatar(userID bson.ObjectID) bool {
	collection := database.DB.Collection(userCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Buscar apenas o campo avatar sem decodificar
	var result bson.M
	opts := options.FindOne().SetProjection(bson.M{"avatar": 1})
	err := collection.FindOne(ctx, bson.M{"_id": userID}, opts).Decode(&result)
	if err != nil {
		return false
	}

	avatar, exists := result["avatar"]
	return exists && avatar != nil
}

// GetUserAvatar retorna o avatar do usuário
func (dao *UserDao) GetUserAvatar(userID bson.ObjectID) (bson.Binary, string, error) {
	collection := database.DB.Collection(userCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Buscar apenas avatar e avatar_mime_type
	var result struct {
		Avatar         bson.Binary `bson:"avatar,omitempty"`
		AvatarMimeType string      `bson:"avatar_mime_type,omitempty"`
	}
	opts := options.FindOne().SetProjection(bson.M{
		"avatar":          1,
		"avatar_mime_type": 1,
	})
	err := collection.FindOne(ctx, bson.M{"_id": userID}, opts).Decode(&result)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			return bson.Binary{}, "", errors.New("usuário não encontrado")
		}
		return bson.Binary{}, "", fmt.Errorf("erro ao buscar avatar: %v", err)
	}

	return result.Avatar, result.AvatarMimeType, nil
}

// GetUserProfile retorna os dados do perfil do usuário (sem senha)
func (dao *UserDao) GetUserProfile(userID bson.ObjectID) (UserDao, error) {
	collection := database.DB.Collection(userCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Usar projection para excluir o campo avatar e password para evitar problemas de decodificação
	opts := options.FindOne().SetProjection(bson.M{
		"avatar":  0, // Excluir avatar da busca para evitar problemas de decodificação
		"password": 0, // Excluir senha por segurança
	})

	var user UserDao
	err := collection.FindOne(ctx, bson.M{"_id": userID}, opts).Decode(&user)
	if err != nil {
		if err == mongo.ErrNoDocuments {
			log.Printf("❌ Usuário não encontrado com ID: %s", userID.Hex())
			return UserDao{}, errors.New("usuário não encontrado")
		}
		log.Printf("❌ Erro ao buscar perfil do usuário: %s - %v", userID.Hex(), err)
		return UserDao{}, fmt.Errorf("erro ao buscar perfil: %v", err)
	}

	// Verificar se o avatar existe usando método auxiliar
	hasAvatar := dao.HasAvatar(userID)
	if hasAvatar {
		// Inicializar Avatar vazio - o controller verificará usando HasAvatar
		user.Avatar = bson.Binary{Subtype: 0, Data: []byte{}}
	}

	log.Printf("✅ Perfil do usuário encontrado: %s - Email: %s - HasAvatar: %v", userID.Hex(), user.Email, hasAvatar)
	return user, nil
}

// UpdateUserProfile atualiza os dados do perfil do usuário
func (dao *UserDao) UpdateUserProfile(userID bson.ObjectID, updates bson.M) error {
	collection := database.DB.Collection(userCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	// Adicionar updated_at
	updates["updated_at"] = time.Now()

	update := bson.M{
		"$set": updates,
	}

	result, err := collection.UpdateOne(ctx, bson.M{"_id": userID}, update)
	if err != nil {
		return err
	}

	if result.MatchedCount == 0 {
		return errors.New("usuário não encontrado")
	}

	return nil
}
