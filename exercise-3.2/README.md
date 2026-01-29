# Exercise 3.2: Back to Ingress

Deployed both "Log output" and "Ping-pong" applications to GKE with Ingress.

## Applications
1. **Log Output App** - Responds to root path `/` with HTML page
2. **Ping-pong App** - Responds to `/pingpong` path with "pong" response

## Results
- Ingress IP: 35.186.202.157
- Log Output App: http://35.186.202.157/ ✅ HTTP 200 OK
- Ping-pong App: http://35.186.202.157/pingpong ✅ HTTP 200 OK with "pong" response
- Cluster: exercise-cluster (us-central1-a)

## Architecture
- GKE Cluster: exercise-cluster
- Ingress Controller: GCE Ingress
- Path-based routing configured:
  - `/` → log-output-service
  - `/pingpong` → pingpong-service
- Both deployments: 2 replicas each

## Files
- `deploy-log-output.yaml` - Log output deployment
- `deploy-pingpong.yaml` - Ping-pong deployment  
- `ingress.yaml` - Ingress configuration
