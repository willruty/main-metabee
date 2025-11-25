package dao

import (
	"context"
	"encoding/json"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type ImageDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Name      string        `bson:"name" json:"name"`
	Data      bson.Binary   `bson:"data" json:"-"`
	MimeType  string        `bson:"mime_type" json:"mime_type"`
	CreatedAt time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt time.Time     `bson:"updated_at" json:"updated_at"`
}

const imageCollectionName = "images"

// MarshalJSON customiza a serialização JSON
func (i ImageDao) MarshalJSON() ([]byte, error) {
	var createdAtStr, updatedAtStr string

	if !i.CreatedAt.IsZero() {
		createdAtStr = i.CreatedAt.Format(time.RFC3339)
	}
	if !i.UpdatedAt.IsZero() {
		updatedAtStr = i.UpdatedAt.Format(time.RFC3339)
	}

	return json.Marshal(&struct {
		ID        string `json:"_id"`
		Name      string `json:"name"`
		MimeType  string `json:"mime_type"`
		CreatedAt string `json:"created_at,omitempty"`
		UpdatedAt string `json:"updated_at,omitempty"`
	}{
		ID:        i.ID.Hex(),
		Name:      i.Name,
		MimeType:  i.MimeType,
		CreatedAt: createdAtStr,
		UpdatedAt: updatedAtStr,
	})
}

// CreateImage cria uma nova imagem no banco
func (dao ImageDao) CreateImage(name string, data []byte, mimeType string) (ImageDao, error) {
	image := ImageDao{
		ID:        bson.NewObjectID(),
		Name:      name,
		Data:      bson.Binary{Subtype: 0, Data: data},
		MimeType:  mimeType,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	collection := database.DB.Collection(imageCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, image)
	if err != nil {
		return ImageDao{}, err
	}

	return image, nil
}

// FindImageByName busca uma imagem pelo nome
func (dao ImageDao) FindImageByName(name string) (ImageDao, error) {
	collection := database.DB.Collection(imageCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var image ImageDao
	err := collection.FindOne(ctx, bson.M{"name": name}).Decode(&image)
	if err != nil {
		return ImageDao{}, err
	}

	return image, nil
}

// FindImageByID busca uma imagem pelo ID
func (dao ImageDao) FindImageByID(id bson.ObjectID) (ImageDao, error) {
	collection := database.DB.Collection(imageCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var image ImageDao
	err := collection.FindOne(ctx, bson.M{"_id": id}).Decode(&image)
	if err != nil {
		return ImageDao{}, err
	}

	return image, nil
}

// UpdateImage atualiza uma imagem existente
func (dao ImageDao) UpdateImage(id bson.ObjectID, name string, data []byte, mimeType string) error {
	collection := database.DB.Collection(imageCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"name":       name,
			"data":       bson.Binary{Subtype: 0, Data: data},
			"mime_type":  mimeType,
			"updated_at": time.Now(),
		},
	}

	_, err := collection.UpdateOne(ctx, bson.M{"_id": id}, update)
	return err
}

// DeleteImage deleta uma imagem
func (dao ImageDao) DeleteImage(id bson.ObjectID) error {
	collection := database.DB.Collection(imageCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.DeleteOne(ctx, bson.M{"_id": id})
	return err
}

