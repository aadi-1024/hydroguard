package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) GetCoordinatesByDam(ctx context.Context, damId int) ([]models.Coordinate, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.Coordinate, 0)
	err := d.conn.WithContext(ctx).Find(&data).Where("dam_id = ?", damId).Error
	return data, err
}
