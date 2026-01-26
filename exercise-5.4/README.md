# Exercise 5.4: Wikipedia with init and sidecar

## Objective
Create a Pod with init container and sidecar container that serve Wikipedia pages.

## Requirements
1. Main nginx container serving from public www directory
2. Init container that fetches Kubernetes Wikipedia page
3. Sidecar container that waits 5-15 minutes and fetches random Wikipedia pages

## Solution
- **Pod**: `wikipedia` 
- **Init container**: `get-page` - fetches https://en.wikipedia.org/wiki/Kubernetes
- **Main container**: `nginx` - serves content from `/usr/share/nginx/html`
- **Sidecar container**: `sidecar` - fetches random pages every 5-15 minutes
- **Shared volume**: `html` - `emptyDir` volume shared between all containers

## Files
- `pod.yaml` - Pod definition with init and sidecar containers

## Test
```bash
kubectl apply -f pod.yaml
kubectl get pod wikipedia
kubectl port-forward wikipedia 8080:80
# Open http://localhost:8080/kubernetes.html
