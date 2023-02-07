package main

import (
	"fmt"
	"log"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/dominickbrasileiro/code-delivery/simulator/application/kafka"
	infra "github.com/dominickbrasileiro/code-delivery/simulator/infra/kafka"
	"github.com/joho/godotenv"
)

func init() {
	err := godotenv.Load()
	if err != nil {
		log.Fatal("failed to load .env file: " + err.Error())
	}
}

func main() {
	msgChan := make(chan *ckafka.Message)
	errChan := make(chan error)
	consumer := infra.NewKafkaConsumer(msgChan)
	go consumer.Consume()
	for {
		select {
		case msg := <-msgChan:
			go kafka.Produce(msg, errChan)
		case err := <-errChan:
			fmt.Println("failed to produce message: " + err.Error())
		}
	}
}
