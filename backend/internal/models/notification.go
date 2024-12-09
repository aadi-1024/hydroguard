package models

import "time"

type Notification struct {
	Id        int       `json:"id" gorm:"primaryKey"`
	DamId     int       `json:"dam_id" gorm:"default:null"`
	UserId    int       `json:"user_id" gorm:"default:null"`
	Level     string    `json:"level"`
	Content   string    `json:"content"`
	CreatedAt time.Time `json:"created_at"`
}
