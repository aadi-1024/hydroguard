package database

import (
	"context"
	"hydroguard/internal/models"
	"time"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

type Database struct {
	conn    *gorm.DB
	timeout time.Duration
}

func InitDB(dsn string, timeout time.Duration) (Database, error) {
	db := Database{}
	conn, err := gorm.Open(postgres.Open(dsn), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		return db, err
	}

	db.conn = conn
	db.timeout = timeout
	err = conn.AutoMigrate(&models.Dam{}, &models.Notification{}, &models.Coordinate{}, &models.User{}, &models.Analysis{}, &models.NotificationsRead{})
	return db, err
}

func (d Database) Ctx(c context.Context) (context.Context, context.CancelFunc) {
	return context.WithTimeout(c, d.timeout)
}
