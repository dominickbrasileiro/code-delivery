docker compose -f ./apache-kafka/docker-compose.yml down
docker compose -f ./simulator/docker-compose.yml down
docker compose -f ./nest-backend/docker-compose.yml down
docker compose -f ./react-frontend/docker-compose.yml down
sudo rm -rf ./nest-backend/.docker/dbdata
