# Exercise 3.6: Automatic Deployment with Persistent Volumes

Configured automatic deployment for the project with proper deployment strategy for Persistent Volume handling.

## Requirements
1. **Automatic deployment** with appropriate strategy
2. **Handle PVC access modes**: ReadWriteOnce requires Recreate strategy
3. **Ingress compatibility**: Services must respond at `/` path

## Solution

### 1. Deployment Strategy Selection
- **Default**: `RollingUpdate` (for stateless apps)
- **With ReadWriteOnce PVC**: `Recreate` strategy
- Reason: ReadWriteOnce volumes can only be mounted by one pod at a time

### 2. PVC Configuration Options
**Option A**: Recreate Strategy
\`\`\`yaml
strategy:
  type: Recreate
\`\`\`

**Option B**: Use ReadWriteMany access mode
\`\`\`yaml
accessModes:
  - ReadWriteMany
\`\`\`

### 3. Automatic Deployment Features
- **Readiness probes**: Ensure pod is ready before serving traffic
- **Liveness probes**: Automatic restart if app crashes
- **Resource limits**: Prevent resource exhaustion
- **Pod disruption budgets**: Control during updates

## Implementation

### Deployment with Recreate Strategy (for ReadWriteOnce)
\`\`\`yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: project-deployment
spec:
  replicas: 1  # Single pod for ReadWriteOnce
  strategy:
    type: Recreate  # Required for ReadWriteOnce PVC
  selector:
    matchLabels:
      app: project-app
  template:
    metadata:
      labels:
        app: project-app
    spec:
      containers:
      - name: project-container
        image: project:latest
        ports:
        - containerPort: 3000
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        volumeMounts:
        - name: data-volume
          mountPath: /app/data
      volumes:
      - name: data-volume
        persistentVolumeClaim:
          claimName: project-pvc
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: project-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
\`\`\`

### Alternative: ReadWriteMany with RollingUpdate
\`\`\`yaml
accessModes:
  - ReadWriteMany  # Allows multiple pods
strategy:
  type: RollingUpdate  # Now safe with ReadWriteMany
  rollingUpdate:
    maxSurge: 1
    maxUnavailable: 0
\`\`\`

## Health Checks for Automatic Deployment
\`\`\`yaml
readinessProbe:
  httpGet:
    path: /  # Must respond at root for Ingress
    port: 3000
  initialDelaySeconds: 10
  periodSeconds: 5

livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 15
  periodSeconds: 20
\`\`\`

## Files
- \`deployment-with-pvc.yaml\` - Deployment with PVC and Recreate strategy
- \`deployment-readwrite-many.yaml\` - Alternative with ReadWriteMany
- \`service-ingress-ready.yaml\` - Service configured for Ingress
