package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) CreateNotification(ctx context.Context, notif models.Notification) (models.Notification, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Create(&notif).Error
	return notif, err
}

func (d *Database) GetAllNotifications(ctx context.Context, limit, offset int, read string) ([]models.Notification, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.Notification, 0)

	query := d.conn.WithContext(ctx).Model(&models.Notification{})
	if limit > 0 {
		query.Limit(limit).Offset(offset)
	}
	if read == "true" {
		query.Where("read = ?", true)
	} else if read == "false" {
		query.Where("read = ?", false)
	}
	err := query.Order("created_at DESC").Find(&data).Error
	return data, err
}
