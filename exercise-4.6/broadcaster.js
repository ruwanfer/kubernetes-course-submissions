const { connect, StringCodec } = require('nats');

const NATS_URL = process.env.NATS_URL || 'nats://my-nats:4222';
const WEBHOOK_URL = process.env.WEBHOOK_URL || 'https://discord.com/api/webhooks/...';
const SERVICE_NAME = process.env.SERVICE_NAME || 'broadcaster';

async function startBroadcaster() {
  console.log(`Starting ${SERVICE_NAME}...`);
  console.log(`NATS URL: ${NATS_URL}`);
  console.log(`Webhook URL: ${WEBHOOK_URL ? 'Set' : 'Not set'}`);

  try {
    // Connect to NATS
    const nc = await connect({ servers: NATS_URL });
    console.log('Connected to NATS');

    const sc = StringCodec();
    
    // Create subscription with queue group for load balancing
    const sub = nc.subscribe('todos.events', {
      queue: 'broadcasters'  // Queue group ensures only one broadcaster gets each message
    });

    console.log('Subscribed to todos.events (queue: broadcasters)');

    // Process messages
    for await (const msg of sub) {
      try {
        const data = JSON.parse(sc.decode(msg.data));
        console.log(`[${SERVICE_NAME}] Received event: ${data.event} for todo ${data.todo.id}`);

        // Send to external service
        await sendToExternalService(data);
        
        console.log(`[${SERVICE_NAME}] Message processed successfully`);
      } catch (err) {
        console.error(`[${SERVICE_NAME}] Error processing message:`, err);
      }
    }

  } catch (err) {
    console.error('Failed to start broadcaster:', err);
    process.exit(1);
  }
}

// Send message to external service (Discord/Telegram/Slack/Generic)
async function sendToExternalService(data) {
  if (!WEBHOOK_URL || WEBHOOK_URL.includes('example.com')) {
    // Simulate sending for testing
    console.log(`[${SERVICE_NAME}] Would send to external service:`, {
      event: data.event,
      todoId: data.todo.id,
      text: data.todo.text,
      done: data.todo.done
    });
    return;
  }

  // For Discord
  const discordPayload = {
    content: `📝 **Todo ${data.event}**\nID: ${data.todo.id}\nText: ${data.todo.text}\nStatus: ${data.todo.done ? '✅ Done' : '⏳ Pending'}`,
    username: 'Todo Bot',
    avatar_url: 'https://cdn-icons-png.flaticon.com/512/3208/3208720.png'
  };

  // For generic webhook
  const genericPayload = {
    user: 'todo-bot',
    message: `Todo ${data.event}: "${data.todo.text.substring(0, 50)}..."`,
    todoId: data.todo.id,
    event: data.event,
    done: data.todo.done,
    timestamp: data.timestamp
  };

  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)  // Change to genericPayload for generic webhook
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    console.log(`[${SERVICE_NAME}] Message sent to external service`);
  } catch (err) {
    console.error(`[${SERVICE_NAME}] Failed to send to external service:`, err);
    throw err;
  }
}

// Health endpoint for Kubernetes probes
const http = require('http');
const healthServer = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      service: SERVICE_NAME,
      timestamp: new Date().toISOString()
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

healthServer.listen(8080, () => {
  console.log('Health server listening on port 8080');
});

// Start the broadcaster
startBroadcaster();
