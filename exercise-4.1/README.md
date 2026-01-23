# Exercise 4.1: Readiness Probes

## Ping-pong ReadinessProbe:
- Path: /count (queries database)
- Ready when: Database connection successful
- Configuration:
  - httpGet: {path: /count, port: 3001}
  - initialDelaySeconds: 10
  - periodSeconds: 5
  - failureThreshold: 3

## Log output ReadinessProbe:
- Path: /status (checks pingpong connection)
- Ready when: Can reach pingpong service
- Configuration: Same parameters as pingpong

## Automatic Recovery:
When database becomes unavailable:
1. Ping-pong readiness fails → becomes 0/1
2. Log output detects pingpong down → becomes 1/2
3. When database restored, both automatically become ready
