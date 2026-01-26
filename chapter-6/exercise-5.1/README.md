# Exercise 5.1: DummySite CRD & Controller

## Overview
Create a Custom Resource Definition (CRD) and controller for DummySite resources that copy websites.

## Files Structure
- `dummysite-crd.yaml` - CRD definition
- `rbac.yaml` - RBAC configurations
- `controller-deployment.yaml` - Controller deployment
- `example-dummysite.yaml` - Example DummySite resource
- `website-deployment-template.yaml` - Template for website deployments
- `controller/` - Controller implementation (JavaScript)

## Deployment Steps

1. **Apply CRD:**
```bash
kubectl apply -f dummysite-crd.yaml
