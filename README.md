Based on these steps:
https://chat.openai.com/share/12c8b5b5-cba8-4225-b85b-9ded4c76140c

- Setup Node service and install NPM packages
- Install RabbitMQ (via Docker) and spin up the rabbitmq-server
- Use the following CURL command to send a request which includes inter-service communication using RabbitMQ

```
curl --location 'http://localhost:3001/user' \
--header 'Content-Type: application/json' \
--data-raw '{
    "username": "Tirth",
    "email": "tirth@example.com"
}'
```

Tirth Docker ID
tirthdocker2001

cd ms_nodejs_rabbitmq/userService
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-userservice:latest .

cd ms_nodejs_rabbitmq/orderService
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-orderservice:latest .

cd ms_nodejs_rabbitmq/rabbitMQ
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-rabbitmq:latest .

GCP Project ID
micro-services-406818

# Build and push userService image

docker build -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-userservice:latest userService/
docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-userservice:latest

docker buildx build --platform linux/arm64 -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-userservice-v2:arm64 userService/

docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-userservice-v2:arm64

# Build and push orderService image

docker build -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-orderservice:latest orderService/
docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-orderservice:latest

docker buildx build --platform linux/arm64 -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-orderservice-v2:arm64 orderService/

docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-orderservice-v2:arm64

# Build and push rabbitMQ image

docker build -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-rabbitmq:latest rabbitMQ/
docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-rabbitmq:latest

docker buildx build --platform linux/arm64 -t gcr.io/micro-services-406818/ms_nodejs_rabbitmq-rabbitmq-v2:arm64

docker push gcr.io/micro-services-406818/ms_nodejs_rabbitmq-rabbitmq-v2:arm64

# Kubernetes deploy command

kubectl apply -f userService-deployment.yaml
kubectl apply -f orderService-deployment.yaml
kubectl apply -f rabbitMQ-deployment.yaml
kubectl apply -f userService-service.yaml
kubectl apply -f orderService-service.yaml
kubectl apply -f rabbitMQ-service.yaml

kubectl apply -f deployment.yaml
kubectl apply -f service.yaml

docker run -it --rm gcr.io/micro-services-406818/ms_nodejs_rabbitmq-userservice-v2:arm64 sh
