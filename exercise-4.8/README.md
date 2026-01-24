# Exercise 4.8: GitOps for The Project

## Objective:
Move The Project application to GitOps workflow using ArgoCD.

## Setup:
1. Install ArgoCD (if not already installed)
2. Apply ArgoCD Application manifest
3. Configure GitHub Secrets (DOCKERHUB_USERNAME, DOCKERHUB_TOKEN)
4. Enable GitHub Actions write permissions

## Files:
- `argocd-application.yaml`: ArgoCD Application for The Project
- `kustomization.yaml`: Kustomize configuration
- `deployment.yaml`: Deployment with image placeholder
- `github-actions.yaml`: GitHub Actions workflow
- `service.yaml`, `ingress.yaml`: Existing manifests

## Workflow:
1. Push changes to The Project code
2. GitHub Actions builds new Docker image
3. Kustomize updates image reference
4. ArgoCD detects changes and deploys to cluster

## Note:
- Uses `main` branch as source (as specified in exercise)
- Automated sync policy enabled
- Creates namespace if not exists
