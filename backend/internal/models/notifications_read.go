package models

type NotificationsRead struct {
	NotificationId int `json:"notification_id" gorm:"primaryKey"`
	UserId         int `json:"user_id" gorm:"primaryKey"`
}
