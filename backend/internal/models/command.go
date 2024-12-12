package models

type CommandCoordinate struct {
	DamId     int     `json:"dam_id" gorm:"default:null"`
	Latitude  float64 `json:"latitude"`
	Longitude float64 `json:"longitude"`
}
