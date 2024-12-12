package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d Database) CreateCropAnalysis(ctx context.Context, c models.CropAnalysis) (models.CropAnalysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Create(&c).Error
	return c, err
}

func (d Database) GetAllCropAnalysis(ctx context.Context) ([]models.CropAnalysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.CropAnalysis, 0)
	err := d.conn.WithContext(ctx).Order("created_at DESC").Find(&data).Error
	return data, err
}

func (d Database) GetCropAnalysisById(ctx context.Context, id int) (models.CropAnalysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	m := models.CropAnalysis{}

	err := d.conn.WithContext(ctx).First(&m, id).Error
	return m, err
}

func (d Database) GetCropAnalysisByDamId(ctx context.Context, id int) ([]models.CropAnalysis, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	data := make([]models.CropAnalysis, 0)
	err := d.conn.WithContext(ctx).Model(&models.CropAnalysis{}).Where("dam_id = ?", id).Order("created_at DESC").Find(&data).Error
	return data, err
}
