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

# Kubernetes Dashboard create SA and get token

## Create service account

kubectl create serviceaccount my-dashboard-sa -n kubernetes-dashboard

## Create token manually

kubectl create secret generic my-dashboard-sa-token --from-literal=token=$(kubectl get secret -n kubernetes-dashboard $(kubectl get sa my-dashboard-sa -n kubernetes-dashboard -o jsonpath='{.secrets[0].name}') -o jsonpath='{.data.token}' | base64 --decode) -n kubernetes-dashboard

## Bind the service account to a cluster role (e.g., cluster-admin)

kubectl create clusterrolebinding my-dashboard-sa-binding --clusterrole=cluster-admin --serviceaccount=kubernetes-dashboard:my-dashboard-sa

## Get the secret name associated with the service account

SECRET_NAME=$(kubectl -n kubernetes-dashboard get sa/my-dashboard-sa -o jsonpath="{.secrets[0].name}")

## Get the token

TOKEN=$(kubectl -n kubernetes-dashboard get secret/${SECRET_NAME} -o jsonpath="{.data.token}" | base64 --decode)

echo "Token: ${TOKEN}"

---

# Get temporary token

kubectl create token <service account name> -n <namespace>
kubectl create token dashboard-admin (this is service account name) -n kubernetes-dashboard (namespace)
kubectl create token dashboard-admin -n kubernetes-dashboard --duration=360h --output json

kubectl apply -f - <<EOF
apiVersion: v1
kind: Secret
metadata:
name: dashboard-admin-secret
annotations:
kubernetes.io/service-account.name: dashboard-admin
type: kubernetes.io/service-account-token
EOF
