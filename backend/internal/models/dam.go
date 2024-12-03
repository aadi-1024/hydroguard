package models

import "time"

type Dam struct {
	Id              int            `json:"id" gorm:"primaryKey"`
	Name            string         `json:"name"`
	Latitude        float32        `json:"latitude"`
	Longitude       float32        `json:"longitude"`
	Status          string         `json:"status"`
	LastMaintenance time.Time      `json:"last_maintenance"`
	WaterCover      float32        `json:"water_cover" gorm:"default:null"`
	Notifications   []Notification `json:"notifications,omitempty"`
	Coordinates     []Coordinate   `json:"coordinates,omitempty"`
}
