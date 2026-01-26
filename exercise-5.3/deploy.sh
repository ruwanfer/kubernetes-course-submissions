#!/bin/bash
echo "=== Deploying Exercise 5.3 ==="

echo "1. Installing Gateway API CRDs..."
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml 2>/dev/null || echo "CRDs may already exist"

echo "2. Deploying greeters..."
kubectl apply -f greeter-v1.yaml
kubectl apply -f greeter-v2.yaml

echo "3. Deploying services..."
kubectl apply -f services.yaml

echo "4. Deploying log app..."
kubectl apply -f log-app.yaml

echo "5. Setting up traffic splitting..."
kubectl apply -f traffic-split.yaml

echo "✅ All resources deployed!"
sleep 5
kubectl get pods
