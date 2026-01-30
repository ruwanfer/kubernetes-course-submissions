# Exercise 3.8: Delete Environment on Branch Delete

Delete Kubernetes namespace when Git branch is deleted.

## Solution
GitHub Actions workflow runs when branch is deleted to cleanup namespace.

## Workflow File: .github/workflows/cleanup.yaml
```yaml
name: Cleanup on Branch Delete
on:
  delete:
    branches: ['**']
jobs:
  cleanup:
    runs-on: ubuntu-latest
    steps:
    - name: Delete Namespace
      run: |
        BRANCH="${{ github.event.ref }}"
        BRANCH="${BRANCH#refs/heads/}"
        if [ "$BRANCH" != "main" ]; then
          NAMESPACE=$(echo "$BRANCH" | tr '/' '-')
          kubectl delete namespace $NAMESPACE --ignore-not-found
        fi
Manual Script: cleanup.sh
bash
#!/bin/bash
BRANCH=$1
NAMESPACE=$(echo "$BRANCH" | tr '/' '-')
kubectl delete namespace $NAMESPACE --ignore-not-found
Examples
Delete branch: feature/login

Deletes namespace: feature-login

Skip: main branch (keeps project namespace)

Steps
Branch deleted → GitHub Actions triggers

Convert branch name to namespace name

Delete Kubernetes namespace

Cleanup complete
