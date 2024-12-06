package main

import (
	"hydroguard/internal/database"
	"hydroguard/internal/mailer"

	"github.com/rabbitmq/amqp091-go"
)

type App struct {
	cache  database.Cache
	db     database.Database
	mailer mailer.Mailer
	queue  *amqp091.Connection
}
