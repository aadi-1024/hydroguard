package models

import "time"

type Analysis struct {
	Id            int       `json:"id" gorm:"primaryKey"`
	DamId         int       `json:"dam_id"`
	WaterCover    float64   `json:"water_cover"`
	LiveVolume    float64   `json:"live_volume"`
	Sedimentation float64   `json:"sedimentation"`
	CreatedAt     time.Time `json:"created_at"`
}
