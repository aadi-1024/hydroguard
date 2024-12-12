package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d Database) GetCommandCoordinatesByDamId(ctx context.Context, damId int) ([]models.CommandCoordinate, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.CommandCoordinate, 0)

	err := d.conn.WithContext(ctx).Model(&models.CommandCoordinate{}).Where("dam_id = ?", damId).Find(&data).Error
	return data, err
}
