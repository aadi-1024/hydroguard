package models

type User struct {
	Name     string `json:"name"`
	Email    string `json:"email" gorm:"primaryKey"`
	Password string `json:"password,omitempty"`
}
