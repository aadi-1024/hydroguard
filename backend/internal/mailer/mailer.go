package mailer

import (
	"context"
	"hydroguard/internal/models"

	"github.com/wneessen/go-mail"
)

type Mailer struct {
	c *mail.Client
}

func InitMailer() (Mailer, error) {
	m := Mailer{}

	c, err := mail.NewClient("127.0.0.1", mail.WithPort(1025), mail.WithTLSPolicy(mail.NoTLS))
	m.c = c
	return m, err
}

func (m Mailer) SendMail(ctx context.Context, data models.Mail) error {
	msg := mail.NewMsg()
	if err := msg.To(data.To); err != nil {
		return err
	}
	if err := msg.From(data.From); err != nil {
		return err
	}
	msg.Subject(data.Subject)
	msg.SetBodyString(mail.TypeTextHTML, data.Content)

	return m.c.DialAndSendWithContext(ctx, msg)
}
