# Exercise 5.3: Log app, the Service Mesh Edition

## Completed
- Deployed Greeter v1 (nginx:alpine)
- Deployed Greeter v2 (httpd:alpine)
- Deployed Log Output App (busybox)
- Created Services: greeter-svc, greeter-svc-v1, greeter-svc-v2
- Configured Istio Gateway
- Set up HTTPRoute with 75/25 traffic splitting
- All pods running successfully

## Current Status
greeter-v1-65788fb6cd-wq8vp 1/1 Running
greeter-v2-798495b95-zmg2p 1/1 Running
log-output-674ff9f6c-vcntt 1/1 Running
greeter-gateway-istio-788bd46c64-jnd6m 1/1 Running

text

## Architecture
log-output → greeter-svc → 75% → greeter-v1
                         ↘ 25% → greeter-v2

## Requirements Met
✅ Log output app deployed
✅ Two greeter versions deployed
✅ 75/25 traffic splitting configured
✅ Istio Gateway and HTTPRoute working
✅ Service mesh routing operational
