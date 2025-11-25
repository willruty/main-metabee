package dao

import (
	"context"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type NewsDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	Title     string             `bson:"title"`
	Content   string             `bson:"content"`
	Image     string             `bson:"image,omitempty"`
	Author    string             `bson:"author"`
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
}

const newsCollectionName = "news"

func (dao NewsDao) GetLastTwoNews() ([]NewsDao, error) {
	collection := database.DB.Collection(newsCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}).SetLimit(2)
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

func (dao NewsDao) CreateNews(news NewsDao) (NewsDao, error) {
	news.ID = bson.NewObjectID()
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

