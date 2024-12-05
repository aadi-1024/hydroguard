package main

import (
	"fmt"
	"hydroguard/internal/database"
	"hydroguard/internal/mailer"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
	"github.com/labstack/echo/v4"
)

var app *App

func main() {
	app = &App{}
	e := echo.New()

	godotenv.Load("../.env")

	db, err := database.InitDB(fmt.Sprintf("postgres://%s:%s@localhost:%s/%s", os.Getenv("POSTGRES_USER"), os.Getenv("POSTGRES_PASSWORD"), os.Getenv("POSTGRES_PORT"), os.Getenv("POSTGRES_DB")), 3*time.Second)
	if err != nil {
		log.Fatal(err.Error())
	}
	cache, err := database.InitCache("127.0.0.1:11211")
	if err != nil {
		log.Fatal(err.Error())
	}
	mailer, err := mailer.InitMailer()
	if err != nil {
		log.Fatal(err.Error())
	}

	app.cache = cache
	app.db = db
	app.mailer = mailer
	SetupRoutes(e)

	if err := e.Start("0.0.0.0:8080"); err != nil {
		log.Println(err.Error())
	}
}
