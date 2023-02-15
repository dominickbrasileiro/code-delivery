docker compose -f ./apache-kafka/docker-compose.yml up --build -d
docker compose -f ./simulator/docker-compose.yml up --build -d
docker compose -f ./nest-backend/docker-compose.yml up --build -d
docker compose -f ./react-frontend/docker-compose.yml up --build -d
