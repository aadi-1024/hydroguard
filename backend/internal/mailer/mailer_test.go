package mailer_test

import (
	"hydroguard/internal/mailer"
	"testing"
)

func TestSendMail(t *testing.T) {
	m, err := mailer.InitMailer()
	if err != nil {
		t.Log(err.Error())
		t.FailNow()
	}

	if err := m.SendMail("user@email.com", "hii", "this is a mail"); err != nil {
		t.Log(err.Error())
		t.FailNow()
	}
}
