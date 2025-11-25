package dao

import (
	"context"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
	"go.mongodb.org/mongo-driver/v2/mongo/options"
)

type UserProgressDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"`
	CourseID  bson.ObjectID `bson:"course_id"`
	Progress  float64           `bson:"progress"` // 0-100
	Hours     float64           `bson:"hours"`    // horas estudadas
	LastStudy time.Time         `bson:"last_study"`
	CreatedAt time.Time         `bson:"created_at"`
	UpdatedAt time.Time         `bson:"updated_at"`
}

type StudySessionDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"`
	CourseID  bson.ObjectID `bson:"course_id"`
	LessonID  bson.ObjectID `bson:"lesson_id,omitempty"`
	Duration  float64           `bson:"duration"` // em horas
	Date      time.Time         `bson:"date"`
	CreatedAt time.Time         `bson:"created_at"`
}

const userProgressCollectionName = "user_progress"
const studySessionCollectionName = "study_session"

// GetActiveCourses retorna os cursos ativos do usuário (com progresso > 0 e < 100)
func (dao UserProgressDao) GetActiveCourses(userID bson.ObjectID) ([]UserProgressDao, error) {
	collection := database.DB.Collection(userProgressCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	filter := bson.M{
		"user_id": userID,
		"progress": bson.M{
			"$gt": 0,
			"$lt": 100,
		},
	}

	cursor, err := collection.Find(ctx, filter)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var progresses []UserProgressDao
	if err := cursor.All(ctx, &progresses); err != nil {
		return nil, err
	}

	return progresses, nil
}

// GetHoursThisMonth retorna as horas estudadas no mês atual
func (dao UserProgressDao) GetHoursThisMonth(userID bson.ObjectID) (float64, error) {
	collection := database.DB.Collection(studySessionCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	now := time.Now()
	startOfMonth := time.Date(now.Year(), now.Month(), 1, 0, 0, 0, 0, now.Location())

	pipeline := []bson.M{
		{
			"$match": bson.M{
				"user_id": userID,
				"date": bson.M{
					"$gte": startOfMonth,
				},
			},
		},
		{
			"$group": bson.M{
				"_id": nil,
				"total_hours": bson.M{
					"$sum": "$duration",
				},
			},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result struct {
		TotalHours float64 `bson:"total_hours"`
	}

	if cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return 0, err
		}
		return result.TotalHours, nil
	}

	return 0, nil
}

// GetAverageProgress retorna o progresso médio de todos os cursos do usuário
func (dao UserProgressDao) GetAverageProgress(userID bson.ObjectID) (float64, error) {
	collection := database.DB.Collection(userProgressCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pipeline := []bson.M{
		{
			"$match": bson.M{
				"user_id": userID,
			},
		},
		{
			"$group": bson.M{
				"_id": nil,
				"avg_progress": bson.M{
					"$avg": "$progress",
				},
			},
		},
	}

	cursor, err := collection.Aggregate(ctx, pipeline)
	if err != nil {
		return 0, err
	}
	defer cursor.Close(ctx)

	var result struct {
		AvgProgress float64 `bson:"avg_progress"`
	}

	if cursor.Next(ctx) {
		if err := cursor.Decode(&result); err != nil {
			return 0, err
		}
		return result.AvgProgress, nil
	}

	return 0, nil
}

// GetRecentLessons retorna as aulas recentes do usuário
func GetRecentLessons(userID bson.ObjectID, limit int) ([]StudySessionDao, error) {
	collection := database.DB.Collection(studySessionCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	opts := options.Find().
		SetSort(bson.D{{Key: "date", Value: -1}}).
		SetLimit(int64(limit))

	filter := bson.M{"user_id": userID}
	cursor, err := collection.Find(ctx, filter, opts)
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var sessions []StudySessionDao
	if err := cursor.All(ctx, &sessions); err != nil {
		return nil, err
	}

	return sessions, nil
}

