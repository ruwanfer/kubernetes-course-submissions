# Exercise 4.6: Broadcaster Service with NATS

## Architecture:
1. **Todo Backend** - Publishes events to NATS when todos are created/updated
2. **Broadcaster Service** - Subscribes to NATS events, sends to external service
3. **NATS Message Queue** - Handles message distribution

## Features:
- **Queue groups** - Ensures messages are processed only once even with 6 replicas
- **External service integration** - Discord/Telegram/Slack/Generic webhook
- **Scalability** - Tested with 6 broadcaster replicas
- **Reliability** - No duplicate messages

## Setup:
1. Install NATS: `helm install -f nats-values.yaml my-nats oci://registry-1.docker.io/bitnamicharts/nats`
2. Deploy updated todo-backend: `kubectl apply -f todo-backend-deployment.yaml`
3. Deploy broadcaster: `kubectl apply -f broadcaster-deployment.yaml`

## Testing:
- Create/update todos via todo-backend API
- Events published to NATS subject: `todos.events`
- Broadcasters in queue group receive messages
- Messages sent to configured webhook

## Queue Group Configuration:
```javascript
const sub = nc.subscribe('todos.events', {
  queue: 'broadcasters'  // Ensures only one broadcaster gets each message
});

