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
