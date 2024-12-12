package models

type Crop struct {
	Id        int     `json:"id" gorm:"primaryKey"`
	Name      string  `json:"name" gorm:"unique"`
	Season    string  `json:"season"`
	L1        int     `json:"l1"`
	L2        int     `json:"l2"`
	L3        int     `json:"l3"`
	L4        int     `json:"l4"`
	Total     int     `json:"total"`
	Kc1       float64 `json:"kc1"`
	Kc2       float64 `json:"kc2"`
	Kc3       float64 `json:"kc3"`
	Eto       float64 `json:"eto"`
	Etc       float64 `json:"etc"`
	TotalEtc  float64 `json:"total_etc"`
	Drip      bool    `json:"drip"`
	Sprinkler bool    `json:"sprinkler"`
}
