package models

import "time"

type Analysis struct {
	Id            int       `json:"id" gorm:"primaryKey"`
	DamId         int       `json:"dam_id"`
	AnalysisDate  time.Time `json:"analysis_date"`
	Sedimentation string    `json:"sedimentation"`
	WaterCover    string    `json:"water_cover"`
	WaterQuality  string    `json:"water_quaity"`
	Dam           Dam       `json:"dam,omitempty"`
}
