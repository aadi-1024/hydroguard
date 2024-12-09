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

func (d *Database) GetAllNotifications(ctx context.Context, limit, offset, uid int, read string) ([]models.Notification, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.Notification, 0)

	query := d.conn.WithContext(ctx).Model(&models.Notification{})
	if limit > 0 {
		query.Limit(limit).Offset(offset)
	}
	if read == "true" {
		query.Where("id in (?)", d.conn.WithContext(ctx).Model(&models.NotificationsRead{}).Where("user_id = ?", uid).Select("notification_id"))
	} else if read == "false" {
		query.Where("id not in (?)", d.conn.WithContext(ctx).Model(&models.NotificationsRead{}).Where("user_id = ?", uid).Select("notification_id"))
	}
	err := query.Where("user_id = ? or user_id is null", uid).Order("created_at DESC").Find(&data).Error
	return data, err
}

func (d *Database) MarkNotifAsRead(ctx context.Context, notifId, userId int) error {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	m := models.NotificationsRead{NotificationId: notifId, UserId: userId}
	return d.conn.WithContext(ctx).Create(&m).Error
}
