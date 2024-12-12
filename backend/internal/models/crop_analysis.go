package models

import "time"

type CropAnalysis struct {
	Id                   int       `json:"id" gorm:"primaryKey"`
	DamId                int       `json:"dam_id"`
	CreatedAt            time.Time `json:"created_at" gorm:"default"`
	CropWaterRequirement float64   `json:"crop_water_requirement"`
	WaterGivenConfig     float64   `json:"water_given_config"`
	SeepageLosses        float64   `json:"seepage_losses"`
	EvaporationDischarge float64   `json:"evaporation_discharge"`
	CanalLosses          float64   `json:"canal_losses"`
	OptimalWaterUsage    float64   `json:"optimal_water_usage"`
	Suggestions          string    `json:"suggestions"`
	ConfigErrors         string    `json:"config_errors"`
}
