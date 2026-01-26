# Configuration Repository - Exercise 4.10

This repository contains Kubernetes manifests for deploying the Flask application.

## Files:
- `deployment.yaml` - Kubernetes Deployment configuration
- `service.yaml` - Kubernetes Service configuration  
- `configmap.yaml` - Application configuration

## Deployment Instructions:

1. First build and push the Docker image from the application repository:
```bash
cd ../app-repo
docker build -t yourusername/flask-app:latest .
docker push yourusername/flask-app:latest
