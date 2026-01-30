# Exercise 3.7: Branch-based Environments

Each Git branch creates separate Kubernetes namespace.

## Main Branch
- Deploys to: `project` namespace
- Production environment

## Feature Branches
- Branch name = Namespace name
- Example: `feature/login` → `feature-login` namespace
- Isolated testing environment

## Requirements
1. Branch names must be valid namespace names
2. Main branch → `project` namespace
3. Other branches → namespace = branch name

## Simple Solution

### 1. Create namespace from branch name
```bash
if [ "$BRANCH" = "main" ]; then
  NAMESPACE="project"
else
  NAMESPACE=$(echo "$BRANCH" | tr '/' '-')
fi
2. Deploy to that namespace
bash
kubectl create namespace $NAMESPACE
kubectl apply -f deployment.yaml -n $NAMESPACE
3. Branch examples
main → project namespace

feature/login → feature-login namespace

bugfix-123 → bugfix-123 namespace

Files
deploy-by-branch.sh - Deployment script

namespace-examples.md - Examples
