# Exercise 2.8: Database for Project Todos

## 1. PostgreSQL StatefulSet
- StatefulSet with 1 replica in "project" namespace
- Headless Service (clusterIP: None)
- Persistent storage via VolumeClaimTemplate
- Uses Secrets for credentials
- Uses ConfigMap for configuration

## 2. Secrets & ConfigMaps
- Secret: todo-db-secret (username, password, database)
- ConfigMap: todo-db-config (host, port, sslmode)

## 3. Updated Backend
- Uses environment variables from Secret/ConfigMap
- Connects to PostgreSQL database
- Todos stored persistently in database
