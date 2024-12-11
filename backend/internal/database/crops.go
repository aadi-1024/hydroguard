package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) GetAllCropPatterns(ctx context.Context) ([]models.Crop, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	crops := make([]models.Crop, 0)
	err := d.conn.WithContext(ctx).Find(&crops).Error

	return crops, err
}
