package dao

import (
	"context"
	"encoding/json"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type CourseDao struct {
	ID          bson.ObjectID `bson:"_id,omitempty" json:"_id"`
	Title       string        `bson:"title" json:"title"`
	Description string        `bson:"description" json:"description"`
	Image       string        `bson:"image,omitempty" json:"image,omitempty"` // Nome da imagem (images/nome-da-img.extensao)
	ImageID     bson.ObjectID `bson:"image_id,omitempty" json:"image_id,omitempty"` // ID da imagem na collection images
	ImageData   bson.Binary   `bson:"image_data,omitempty" json:"-"` // Mantido para compatibilidade
	ImageType   string        `bson:"image_type,omitempty" json:"image_type,omitempty"` // Mantido para compatibilidade
	Category    string        `bson:"category" json:"category"`
	Duration    int           `bson:"duration" json:"duration"` // em horas
	DriveLink   string        `bson:"drive_link,omitempty" json:"drive_link,omitempty"` // Link da pasta do Drive com os vídeos
	Price       float64       `bson:"price,omitempty" json:"price,omitempty"`
	Grade       float64       `bson:"grade,omitempty" json:"grade,omitempty"` // Nota do curso (0 a 5)
	CreatedAt   time.Time     `bson:"created_at" json:"created_at"`
	UpdatedAt   time.Time     `bson:"updated_at" json:"updated_at"`
}

const courseCollectionName = "courses"

func (c CourseDao) MarshalJSON() ([]byte, error) {
	var createdAtStr, updatedAtStr string
	
	if !c.CreatedAt.IsZero() {
		createdAtStr = c.CreatedAt.Format(time.RFC3339)
	}
	if !c.UpdatedAt.IsZero() {
		updatedAtStr = c.UpdatedAt.Format(time.RFC3339)
	}
	
	imageIDStr := ""
	if !c.ImageID.IsZero() {
		imageIDStr = c.ImageID.Hex()
	}
	
	return json.Marshal(&struct {
		ID          string  `json:"_id"`
		Title       string  `json:"title"`
		Description string  `json:"description"`
		Image       string  `json:"image,omitempty"`
		ImageID     string  `json:"image_id,omitempty"`
		ImageType   string  `json:"image_type,omitempty"`
		Category    string  `json:"category"`
		Duration    int     `json:"duration"`
		DriveLink   string  `json:"drive_link,omitempty"`
		Price       float64 `json:"price,omitempty"`
		Grade       float64 `json:"grade,omitempty"`
		CreatedAt   string  `json:"created_at,omitempty"`
		UpdatedAt   string  `json:"updated_at,omitempty"`
	}{
		ID:          c.ID.Hex(),
		Title:       c.Title,
		Description: c.Description,
		Image:       c.Image,
		ImageID:     imageIDStr,
		ImageType:   c.ImageType,
		Category:    c.Category,
		Duration:    c.Duration,
		DriveLink:   c.DriveLink,
		Price:       c.Price,
		Grade:       c.Grade,
		CreatedAt:   createdAtStr,
		UpdatedAt:   updatedAtStr,
	})
}

func (dao CourseDao) GetLastTwoCourses() ([]CourseDao, error) {
	collection := database.DB.Collection(courseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().SetSort(bson.D{{Key: "created_at", Value: -1}}).SetLimit(2)
	cursor, err := collection.Find(ctx, bson.M{}, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var courses []CourseDao
	if err := cursor.All(ctx, &courses); err != nil {
		return nil, err
	}

	return courses, nil
}

func (dao CourseDao) CreateCourse(course CourseDao) (CourseDao, error) {
	course.ID = bson.NewObjectID()
	course.CreatedAt = time.Now()
	course.UpdatedAt = time.Now()

	collection := database.DB.Collection(courseCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, course)
	if err != nil {
		return CourseDao{}, err
	}

	return course, nil
}

func (dao CourseDao) FindByID(courseID bson.ObjectID) (CourseDao, error) {
	collection := database.DB.Collection(courseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var course CourseDao
	err := collection.FindOne(ctx, bson.M{"_id": courseID}).Decode(&course)
	if err != nil {
		return CourseDao{}, err
	}

	return course, nil
}

func (dao CourseDao) GetAllCourses() ([]CourseDao, error) {
	collection := database.DB.Collection(courseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var courses []CourseDao
	if err := cursor.All(ctx, &courses); err != nil {
		return nil, err
	}

	return courses, nil
}

