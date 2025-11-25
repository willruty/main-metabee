package dao

import (
	"context"
	"encoding/json"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type NewsDao struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title       string        `bson:"title" json:"title"`
	Date        time.Time     `bson:"date" json:"date"`
	Description string        `bson:"description" json:"description"`
	Content     string        `bson:"content" json:"content"`
	Font        string        `bson:"font,omitempty" json:"font,omitempty"`
	Writer      string        `bson:"writer,omitempty" json:"writer,omitempty"`
	Image       string        `bson:"image,omitempty" json:"image,omitempty"` // Nome da imagem (images/nome-da-img.extensao)
	ImageID     bson.ObjectID `bson:"image_id,omitempty" json:"image_id,omitempty"` // ID da imagem na collection images
	CreatedAt   time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time     `bson:"updated_at" json:"updated_at"`
}

const newsCollectionName = "news"

// MarshalJSON customiza a serialização JSON para converter ObjectID em string e garantir snake_case
func (n NewsDao) MarshalJSON() ([]byte, error) {
	var dateStr, createdAtStr, updatedAtStr string
	
	if !n.Date.IsZero() {
		dateStr = n.Date.Format(time.RFC3339)
	}
	if !n.CreatedAt.IsZero() {
		createdAtStr = n.CreatedAt.Format(time.RFC3339)
	}
	if !n.UpdatedAt.IsZero() {
		updatedAtStr = n.UpdatedAt.Format(time.RFC3339)
	}
	
	imageIDStr := ""
	if !n.ImageID.IsZero() {
		imageIDStr = n.ImageID.Hex()
	}
	
	return json.Marshal(&struct {
		ID          string  `json:"_id"`
		Title       string  `json:"title"`
		Date        string  `json:"date,omitempty"`
		Description string  `json:"description"`
		Content     string  `json:"content"`
		Font        string  `json:"font,omitempty"`
		Writer      string  `json:"writer,omitempty"`
		Image       string  `json:"image,omitempty"`
		ImageID     string  `json:"image_id,omitempty"`
		CreatedAt   string  `json:"created_at,omitempty"`
		UpdatedAt   string  `json:"updated_at,omitempty"`
	}{
		ID:          n.ID.Hex(),
		Title:       n.Title,
		Date:        dateStr,
		Description: n.Description,
		Content:     n.Content,
		Font:        n.Font,
		Writer:      n.Writer,
		Image:       n.Image,
		ImageID:     imageIDStr,
		CreatedAt:   createdAtStr,
		UpdatedAt:   updatedAtStr,
	})
}

func (dao NewsDao) GetAllNews() ([]NewsDao, error) {
	collection := database.DB.Collection(newsCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}})
	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var news []NewsDao
	if err := cursor.All(ctx, &news); err != nil {
		return nil, err
	}

	return news, nil
}

func (dao NewsDao) GetLastNews(limit int) ([]NewsDao, error) {
	collection := database.DB.Collection(newsCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "date", Value: -1}}).SetLimit(int64(limit))
	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var news []NewsDao
	if err := cursor.All(ctx, &news); err != nil {
		return nil, err
	}

	return news, nil
}

func (dao NewsDao) FindByID(newsID bson.ObjectID) (NewsDao, error) {
	collection := database.DB.Collection(newsCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var news NewsDao
	err := collection.FindOne(ctx, bson.M{"_id": newsID}).Decode(&news)
	if err != nil {
		return NewsDao{}, err
	}

	return news, nil
}

func (dao NewsDao) CreateNews(news NewsDao) (NewsDao, error) {
	news.ID = bson.NewObjectID()
	if news.Date.IsZero() {
		news.Date = time.Now()
	}
	news.CreatedAt = time.Now()
	news.UpdatedAt = time.Now()

	collection := database.DB.Collection(newsCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, news)
	if err != nil {
		return NewsDao{}, err
	}

	return news, nil
}
