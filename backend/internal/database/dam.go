package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) CreateDam(ctx context.Context, dam models.Dam) (models.Dam, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Save(&dam).Error
	return dam, err
}

func (d *Database) UpdateDam(ctx context.Context, dam models.Dam) (models.Dam, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).UpdateColumns(&dam).Error
	return dam, err
}

func (d *Database) GetAllDams(ctx context.Context) ([]models.Dam, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.Dam, 0)
	err := d.conn.WithContext(ctx).Model(&models.Dam{}).Preload("CommandCoordinates").Preload("Coordinates").Find(&data).Error

	return data, err
}

func (d *Database) GetDamById(ctx context.Context, id int) (models.Dam, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	dam := models.Dam{}
	err := d.conn.WithContext(ctx).Preload("Coordinates").First(&dam, id).Error
	return dam, err
}
