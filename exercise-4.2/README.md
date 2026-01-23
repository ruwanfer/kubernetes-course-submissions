# Exercise 4.2: Probes for The Project

## Added:
1. `/health` endpoint in server.js
2. readinessProbe to deployment
3. livenessProbe to deployment

## Probes Configuration:
- readinessProbe: Checks /health every 5 seconds
- livenessProbe: Checks /health every 10 seconds

## Testing:
- With working backend: Pod stays READY
- With broken backend: Pod becomes NOT READY
