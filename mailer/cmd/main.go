package main

import (
	"encoding/json"
	"log"
	"mailer/pkg"
	"os"
	"os/signal"
	"sync"
	"syscall"

	"github.com/joho/godotenv"
)

func main() {
	godotenv.Load("../.env")

	app, err := InitApp()
	if err != nil {
		log.Fatalln(err.Error())
	}
	defer app.AmqpConn.Close()

	wg := &sync.WaitGroup{}

	readChan, err := app.AmqpConn.Channel()
	if err != nil {
		log.Fatalln(err.Error())
	}
	q, err := readChan.QueueDeclare(
		"mailing",
		false,
		false,
		false,
		false,
		nil,
	)
	if err != nil {
		log.Fatalln(err.Error())
	}

	consumer, err := readChan.Consume(q.Name, "mail-consumer", false, false, false, false, nil)
	if err != nil {
		log.Fatalln(err.Error())
	}

	//handle CtrlC or SIGTERM
	sigch := make(chan os.Signal, 1)
	signal.Notify(sigch, os.Interrupt, syscall.SIGTERM)

loop:
	for {
		select {
		case <-sigch:
			break loop
		case m := <-consumer:
			wg.Add(1)
			go func() {
				defer wg.Done()

				mail := pkg.Mail{}
				if err := json.Unmarshal(m.Body, &mail); err != nil {
					log.Println(err.Error())
					m.Nack(false, false)
					return
				}

				msg, err := createMsg(mail)
				if err != nil {
					log.Println(err.Error())
					m.Nack(false, false)
					return
				}

				if err := app.Mailer.DialAndSend(msg); err != nil {
					log.Println(err.Error())
					m.Nack(false, true)
					return
				}

				m.Ack(false)
			}()
		}
	}

	wg.Wait()
}
