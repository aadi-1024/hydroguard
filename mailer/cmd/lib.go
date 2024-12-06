package main

import (
	"fmt"
	"mailer/pkg"
	"os"
	"strconv"

	"github.com/rabbitmq/amqp091-go"
	"github.com/wneessen/go-mail"
)

type App struct {
	AmqpConn *amqp091.Connection
	Mailer   *mail.Client
}

func InitApp() (App, error) {
	a := App{}

	conn, err := amqp091.Dial(fmt.Sprintf("amqp://%s:%s@localhost:%s/", os.Getenv("RABBITMQ_USER"), os.Getenv("RABBITMQ_PASSWORD"), os.Getenv("RABBITMQ_PORT")))
	if err != nil {
		return a, err
	}

	var port int
	if x, err := strconv.Atoi(os.Getenv("SMTP_PORT")); err != nil {
		port = 587
	} else {
		port = x
	}

	client, err := mail.NewClient(os.Getenv("SMTP_HOST"), mail.WithPort(port), mail.WithTLSPolicy(mail.TLSOpportunistic))

	if err != nil {
		return a, err
	}
	a.AmqpConn = conn
	a.Mailer = client
	return a, nil
}

func createMsg(m pkg.Mail) (*mail.Msg, error) {
	msg := mail.NewMsg()
	if err := msg.To(m.To); err != nil {
		return nil, err
	}
	if err := msg.From(m.From); err != nil {
		return nil, err
	}
	if len(m.Cc) > 0 {
		if err := msg.Cc(m.Cc); err != nil {
			return nil, err
		}
	}
	if len(m.Bcc) > 0 {
		if err := msg.Bcc(m.Bcc); err != nil {
			return nil, err
		}
	}

	msg.Subject(m.Subject)
	msg.SetBodyString(mail.TypeTextHTML, m.Content)

	return msg, nil
}
