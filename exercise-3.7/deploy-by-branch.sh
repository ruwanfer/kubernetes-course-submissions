#!/bin/bash
# Deploy to namespace based on Git branch

# Get current branch
BRANCH=$(git branch --show-current)

# Determine namespace
if [ "$BRANCH" = "main" ]; then
  NAMESPACE="project"
else
  # Convert branch name to valid namespace
  NAMESPACE=$(echo "$BRANCH" | tr '/' '-' | tr '[:upper:]' '[:lower:]')
fi

echo "Deploying branch '$BRANCH' to namespace '$NAMESPACE'"

# Create namespace if doesn't exist
kubectl create namespace "$NAMESPACE" --dry-run=client -o yaml | kubectl apply -f -

# Deploy application
kubectl apply -f deployment.yaml -n "$NAMESPACE"
kubectl apply -f service.yaml -n "$NAMESPACE"

echo "Deployment complete to namespace: $NAMESPACE"
