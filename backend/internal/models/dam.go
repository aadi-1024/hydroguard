package models

import "time"

type Dam struct {
	Id                 int                 `json:"id" gorm:"primaryKey"`
	Name               string              `json:"name"`
	Latitude           float64             `json:"latitude"`
	Longitude          float64             `json:"longitude"`
	MeanDepth          float64             `json:"mean_depth"`
	GrossVolume        float64             `json:"gross_volume"`
	Status             string              `json:"status"`
	LastMaintenance    time.Time           `json:"last_maintenance"`
	Analysis           []Analysis          `json:"analysis,omitempty"`
	Notifications      []Notification      `json:"notifications,omitempty"`
	Coordinates        []Coordinate        `json:"coordinates,omitempty"`
	CommandCoordinates []CommandCoordinate `json:"command_coordinates,omitempty"`
}
