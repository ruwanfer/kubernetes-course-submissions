# Application Repository - Exercise 4.10

## Owner: ruwanfer

This repository contains the source code for the Flask application.

## Files:
- `src/app.py` - Main Flask application
- `Dockerfile` - Docker configuration for building the image
- `requirements.txt` - Python dependencies

## Building the Docker Image:

```bash
# Build the image
docker build -t ruwanfer/flask-app:latest .

# Run locally for testing
docker run -p 5000:5000 -e APP_NAME="Test App" ruwanfer/flask-app:latest
