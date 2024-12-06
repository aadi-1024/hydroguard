package models

import "time"

type Notification struct {
	Id        int       `json:"id" gorm:"primaryKey"`
	DamId     int       `json:"dam_id"`
	Level     string    `json:"level"`
	Content   string    `json:"content"`
	Read      bool      `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}
