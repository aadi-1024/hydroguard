package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) CreateAnalysis(ctx context.Context, analysis models.Analysis) (models.Analysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Create(&analysis).Error
	return analysis, err
}

func (d *Database) GetLatestAnalysis(ctx context.Context, id int) (models.Analysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	anal := models.Analysis{}

	err := d.conn.WithContext(ctx).
		Model(&anal).
		Where("dam_id = ?", id).
		Order("created_at DESC").
		First(&anal).Error

	return anal, err
}

func (d *Database) GetAllAnalysis(ctx context.Context, id, limit int) ([]models.Analysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.Analysis, 0)

	err := d.conn.WithContext(ctx).
		Model(&models.Analysis{}).
		Where("dam_id = ?", id).
		Order("created_at DESC").
		Limit(limit).
		Find(&data).
		Error

	return data, err
}
