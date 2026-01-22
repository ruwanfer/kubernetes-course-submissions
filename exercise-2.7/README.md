# Exercise 2.7: Stateful Applications

## 1. Postgres StatefulSet
- StatefulSet with 1 replica
- Headless Service (clusterIP: None)
- Persistent volume via VolumeClaimTemplate
- StorageClassName: local-path (K3s dynamic provisioning)

## 2. Ping-pong with Database
- Updated to use PostgreSQL instead of memory/file
- Database connection configured via environment variables
- Table auto-created on startup

## Files:
- service.yaml: Headless Service for Postgres
- statefulset.yaml: Postgres StatefulSet with PVC template
- pingpong/: Updated app with PostgreSQL support
