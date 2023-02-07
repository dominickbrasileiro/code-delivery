package kafka

import (
	"encoding/json"
	"os"
	"time"

	ckafka "github.com/confluentinc/confluent-kafka-go/kafka"
	"github.com/dominickbrasileiro/code-delivery/simulator/application/route"
	infra "github.com/dominickbrasileiro/code-delivery/simulator/infra/kafka"
)

func Produce(msg *ckafka.Message, errChan chan error) {
	producer := infra.NewKafkaProducer()
	route := route.NewRoute()
	err := json.Unmarshal(msg.Value, &route)
	if err != nil {
		errChan <- err
	}
	err = route.LoadPositions()
	if err != nil {
		errChan <- err
	}
	positions, err := route.ExportPositionsJson()
	if err != nil {
		errChan <- err
	}
	for _, p := range positions {
		infra.Publish([]byte(p), os.Getenv("KAFKA_PRODUCE_TOPIC"), producer)
		time.Sleep(time.Millisecond * 500)
	}
}
