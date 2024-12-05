package main

import (
	"hydroguard/internal/database"
	"hydroguard/internal/mailer"
)

type App struct {
	cache  database.Cache
	db     database.Database
	mailer mailer.Mailer
}
