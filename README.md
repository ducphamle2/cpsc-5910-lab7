# Build the services using k8s

```bash

# start the minikube first if using mac m1
minikube start

# Start the namespace
kubectl apply -f namespace.yaml

# Start the secrets for AWS configurations
kubectl apply -f secret.yaml

# Start the deployment and services
kubectl apply -f k8s-deployment.yaml

# View all pods given a namespace
kubectl get pods -n cpsc-5910-lab8

# Start minikube tunnel if using Docker Desktop. Eg: minikube service authorization-service --url -n cpsc-5910-lab8
minikube service <kube-service-name> --url -n <namespace>

# View the logs of a pod
kubectl logs <pod-id> -n <namespace>
```
