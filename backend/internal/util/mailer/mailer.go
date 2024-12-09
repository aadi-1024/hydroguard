package mailer

import (
	"context"
	"encoding/json"
	"os"

	"github.com/aadi-1024/hydroguard/mailer/pkg"

	amqp "github.com/rabbitmq/amqp091-go"
)

type Mailer struct {
	conn *amqp.Connection
}

func InitMailer(conn *amqp.Connection) (Mailer, func() error, error) {
	m := Mailer{}

	// conn, err := amqp.Dial(fmt.Sprintf("amqp://%s:%s@localhost:%s/", os.Getenv("RABBITMQ_USER"), os.Getenv("RABBITMQ_PASSWORD"), os.Getenv("RABBITMQ_PORT")))
	// if err != nil {
	// 	return m, nil, err
	// }
	m.conn = conn

	ch, err := conn.Channel()
	if err != nil {
		return m, nil, err
	}

	_, err = ch.QueueDeclare(
		os.Getenv("RABBITMQ_EMAIL_QUEUE"),
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		return m, nil, err
	}

	m.conn = conn

	return m, conn.Close, err
}

func (m Mailer) SendMail(ctx context.Context, data pkg.Mail) error {
	ch, err := m.conn.Channel()
	if err != nil {
		return err
	}
	defer ch.Close()

	enc, err := json.Marshal(data)
	if err != nil {
		return err
	}

	return ch.Publish("", os.Getenv("RABBITMQ_EMAIL_QUEUE"), true, false, amqp.Publishing{
		ContentType: "application/json",
		Body:        enc,
	})
}
