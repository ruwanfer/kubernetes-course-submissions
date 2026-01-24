# Exercise 4.9: Multi-environment GitOps for The Project

## Environments:
1. **Staging** (`project-staging` namespace)
   - Deploys on every commit to `main` branch
   - 1 replica
   - Broadcaster logs only (no external service)
   - No database backups
   - Host: staging.yourdomain.com

2. **Production** (`project-production` namespace)
   - Deploys on tagged commits (v* tags)
   - 3 replicas with resource limits
   - Broadcaster sends to external service
   - Database with backups
   - Host: yourdomain.com (with TLS)
   - Manual sync policy

## Architecture:
- **Base configuration**: Common manifests
- **Overlays**: Environment-specific patches
- **ArgoCD Applications**: One per environment
- **GitHub Actions**: Branch/tag-based deployments

## Key Features:
- Separate namespaces for isolation
- Different deployment triggers (branch vs tags)
- Environment-specific configurations
- Staging: logging-only broadcaster
- Production: full features with backups
