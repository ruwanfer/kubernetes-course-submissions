#!/bin/bash
echo "=== Verifying Exercise 5.3 ==="

echo "1. Pods:"
kubectl get pods -l app=greeter
kubectl get pods -l app=log-output

echo -e "\n2. Services:"
kubectl get svc | grep greeter

echo -e "\n3. Gateway:"
kubectl get gateway

echo -e "\n4. HTTPRoute:"
kubectl get httproute

echo -e "\n✅ Verification complete!"
