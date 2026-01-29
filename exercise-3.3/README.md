# Exercise 3.3: To the Gateway

Replaced Ingress with Gateway API for routing Log output and Ping-pong applications.

## Prerequisites
1. GKE cluster with Gateway API enabled
2. Gateway controller installed (e.g., GKE Gateway controller)

## Setup Required
For GKE clusters, enable Gateway API:
\`\`\`bash
gcloud container clusters update exercise-cluster --zone us-central1-a \
  --enable-gateway-api
\`\`\`

Install Gateway API CRDs:
\`\`\`bash
kubectl apply -f https://github.com/kubernetes-sigs/gateway-api/releases/download/v1.0.0/standard-install.yaml
\`\`\`

## Gateway API Configuration
1. **Gateway**: \`app-gateway\` - Creates external load balancer (replaces Ingress)
2. **HTTPRoute for Log Output**: Routes \`/\` to \`log-output-service:80\`
3. **HTTPRoute for Ping-pong**: Routes \`/pingpong\` to \`pingpong-service:80\`

## Architecture Comparison
- **Before (Exercise 3.2)**: Ingress → Services
- **Now (Exercise 3.3)**: Gateway → HTTPRoutes → Services

## Expected Results
- Gateway IP: Would be provisioned by GKE (similar to Ingress IP)
- Log Output App: http://<GATEWAY_IP>/ ✅
- Ping-pong App: http://<GATEWAY_IP>/pingpong ✅

## Files
- \`gateway.yaml\` - Gateway resource definition
- \`httproute-log-output.yaml\` - HTTPRoute for Log output app  
- \`httproute-pingpong.yaml\` - HTTPRoute for Ping-pong app
