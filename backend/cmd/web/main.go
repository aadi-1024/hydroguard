package main

import (
	"hydroguard/internal/database"
	"log"
	"time"

	"github.com/labstack/echo/v4"
)

var app *App

func main() {
	app = &App{}
	e := echo.New()

	db, err := database.InitDB("postgres://postgres:password@localhost:5432/hydroguard", 3*time.Second)
	if err != nil {
		log.Fatal(err.Error())
	}

	app.db = db
	SetupRoutes(e)

	if err := e.Start("0.0.0.0:8080"); err != nil {
		log.Println(err.Error())
	}
}
