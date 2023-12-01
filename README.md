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

tirthdocker2001

cd ms_nodejs_rabbitmq/userService
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-userservice:latest .

cd ms_nodejs_rabbitmq/orderService
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-orderservice:latest .

cd ms_nodejs_rabbitmq/rabbitMQ
docker build -t tirthdocker2001/ms_nodejs_rabbitmq-rabbitmq:latest .
