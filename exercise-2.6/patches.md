# Exercise 2.6: Remove Hardcoded Configurations

Applied patches to deployments to add environment variables:

## Backend Deployment:
- PORT: "3002"
- MAX_TODO_LENGTH: "140" 
- NODE_ENV: "production"

## Frontend Deployment:
- API_URL: "http://todo-backend-service.project:3002"
- FRONTEND_PORT: "3000"
- MAX_TODO_LENGTH: "140"

## ConfigMap created:
- backend_url
- max_todo_length  
- environment

All configurations now passed via environment variables instead of hardcoded in source.
