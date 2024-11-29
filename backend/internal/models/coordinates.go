package models

type Coordinate struct {
	DamId     int     `json:"dam_id" gorm:"primaryKey;autoIncrement:false"`
	Latitude  float64 `json:"latitude" gorm:"primaryKey;autoIncrement:false"`
	Longitude float64 `json:"longitude" gorm:"primaryKey;autoIncrement:false"`
}
