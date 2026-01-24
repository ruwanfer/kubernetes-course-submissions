# Solution for Exercise 4.10

## Two Repository Setup:

### 1. Application Repository Files:
- Dockerfile
- src/ (source code)
- .github/workflows/build.yaml

### 2. Configuration Repository Files:
- manifests/deployment.yaml
- manifests/service.yaml
- .github/workflows/update.yaml
- argo-apps/application.yaml

## Workflow:
App Code → Build Image → Notify Config Repo → Update Manifests → ArgoCD → Deploy
