## Test 1: With correct setup
- Apply deployment: kubectl apply -f deployment.yaml
- Pod should become READY (1/1)

## Test 2: Simulate database failure
- Change API_BASE_URL to wrong URL in ConfigMap
- Pod should become NOT READY (0/1)
- Health endpoint returns error

## Expected:
- Readiness probe checks /health endpoint
- Liveness probe ensures container restarts if unhealthy
