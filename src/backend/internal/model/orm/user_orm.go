package orm

import "time"

type User struct {
	Id           string    `gorm:"type:uuid;default:uuid_generate_v4();primaryKey" json:"id"`
	Name         string    `gorm:"type:varchar(100)" json:"name"`
	Email        string    `gorm:"type:varchar(255);uniqueIndex;not null" json:"email"`
	PasswordHash string    `gorm:"type:varchar(255);not null" json:"-"`
	CreatedAt    time.Time `gorm:"autoCreateTime" json:"created_at"`
}

type Role struct {
	Id   int    `gorm:"primaryKey;autoIncrement" json:"id"`
	Name string `gorm:"type:varchar(50);uniqueIndex;not null" json:"name"`
}

type UserRole struct {
	UserID    string    `gorm:"type:uuid;not null" json:"user_id"`
	RoleID    int       `gorm:"not null" json:"role_id"`
	CreatedAt time.Time `gorm:"autoCreateTime" json:"created_at"`
}
