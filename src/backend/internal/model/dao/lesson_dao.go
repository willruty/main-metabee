package dao

import (
	"context"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	 
)

type LessonDao struct {
	ID          bson.ObjectID `bson:"_id,omitempty"`
	CourseID    bson.ObjectID `bson:"course_id"`
	Title       string             `bson:"title"`
	Description string             `bson:"description"`
	VideoURL    string             `bson:"video_url,omitempty"`
	Duration    int                `bson:"duration"` // em minutos
	Order       int                `bson:"order"`
	CreatedAt   time.Time          `bson:"created_at"`
	UpdatedAt   time.Time          `bson:"updated_at"`
}

const lessonCollectionName = "lesson"

func (dao LessonDao) GetLessonsByIDs(lessonIDs []bson.ObjectID) ([]LessonDao, error) {
	collection := database.DB.Collection(lessonCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{
		"_id": bson.M{
			"$in": lessonIDs,
		},
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var lessons []LessonDao
	if err := cursor.All(ctx, &lessons); err != nil {
		return nil, err
	}

	return lessons, nil
}

