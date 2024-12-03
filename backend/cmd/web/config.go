package main

import "hydroguard/internal/database"

type App struct {
	cache database.Cache
	db    database.Database
}
