package dao

import (
	"context"
	"metabee/internal/database"
	"time"

	"go.mongodb.org/mongo-driver/v2/bson"
)

type PurchaseDao struct {
	ID        bson.ObjectID `bson:"_id,omitempty"`
	UserID    bson.ObjectID `bson:"user_id"`
	CourseID  bson.ObjectID `bson:"course_id"`
	Status    string             `bson:"status"` // "pending", "completed", "downloading", "downloaded"
	DriveLink string             `bson:"drive_link,omitempty"` // Link da pasta do Drive
	LocalPath string             `bson:"local_path,omitempty"` // Caminho local onde foi baixado
	CreatedAt time.Time          `bson:"created_at"`
	UpdatedAt time.Time          `bson:"updated_at"`
}

const purchaseCollectionName = "purchase"

// CreatePurchase cria uma nova compra de curso
func (dao PurchaseDao) CreatePurchase(userID, courseID bson.ObjectID, driveLink string) (PurchaseDao, error) {
	purchase := PurchaseDao{
		ID:        bson.NewObjectID(),
		UserID:    userID,
		CourseID:  courseID,
		Status:    "pending",
		DriveLink: driveLink,
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}

	collection := database.DB.Collection(purchaseCollectionName)
	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	_, err := collection.InsertOne(ctx, purchase)
	if err != nil {
		return PurchaseDao{}, err
	}

	return purchase, nil
}

// GetPurchasesByUser retorna todas as compras do usuário
func (dao PurchaseDao) GetPurchasesByUser(userID bson.ObjectID) ([]PurchaseDao, error) {
	collection := database.DB.Collection(purchaseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	cursor, err := collection.Find(ctx, bson.M{"user_id": userID})
	if err != nil {
		return nil, err
	}
	defer cursor.Close(ctx)

	var purchases []PurchaseDao
	if err := cursor.All(ctx, &purchases); err != nil {
		return nil, err
	}

	return purchases, nil
}

// GetPurchaseByUserAndCourse retorna uma compra específica
func (dao PurchaseDao) GetPurchaseByUserAndCourse(userID, courseID bson.ObjectID) (PurchaseDao, error) {
	collection := database.DB.Collection(purchaseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	var purchase PurchaseDao
	err := collection.FindOne(ctx, bson.M{
		"user_id":   userID,
		"course_id": courseID,
	}).Decode(&purchase)

	if err != nil {
		return PurchaseDao{}, err
	}

	return purchase, nil
}

// UpdatePurchaseStatus atualiza o status da compra
func (dao PurchaseDao) UpdatePurchaseStatus(purchaseID bson.ObjectID, status string, localPath string) error {
	collection := database.DB.Collection(purchaseCollectionName)

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	update := bson.M{
		"$set": bson.M{
			"status":     status,
			"updated_at": time.Now(),
		},
	}

	if localPath != "" {
		update["$set"].(bson.M)["local_path"] = localPath
	}

	_, err := collection.UpdateOne(ctx, bson.M{"_id": purchaseID}, update)
	return err
}

