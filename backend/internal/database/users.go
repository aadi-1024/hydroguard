package database

import (
	"context"
	"hydroguard/internal/models"
)

func (d *Database) CreateUser(ctx context.Context, user models.User) (models.User, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Create(&user).Error
	return user, err
}

func (d *Database) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	user := models.User{}
	err := d.conn.WithContext(ctx).First(&user, "email = ?", email).Error
	return user, err
}

func (d *Database) UpdateUser(ctx context.Context, user models.User) (models.User, error) {
	ctx, cancel := d.Ctx(ctx)
	defer cancel()

	err := d.conn.WithContext(ctx).Model(&user).UpdateColumns(&user).Error
	return user, err
}
