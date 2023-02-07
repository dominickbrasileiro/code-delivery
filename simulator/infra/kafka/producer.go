package kafka

import (
	"log"
	"os"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
)

func NewKafkaProducer() *ckafka.Producer {
	configMap := &ckafka.ConfigMap{
		"bootstrap.servers": os.Getenv("KAFKA_BOOTSTRAP_SERVERS"),
	}
	p, err := ckafka.NewProducer(configMap)
	if err != nil {
		log.Fatal("failed to create kafka producer: " + err.Error())
	}
	return p
}

func Publish(message []byte, topic string, producer *ckafka.Producer) error {
	msg := &ckafka.Message{
		TopicPartition: ckafka.TopicPartition{
			Topic:     &topic,
			Partition: ckafka.PartitionAny,
		},
		Value: message,
	}
	err := producer.Produce(msg, nil)
	if err != nil {
		return err
	}
	return nil
}
