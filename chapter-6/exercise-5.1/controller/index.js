const k8s = require('@kubernetes/client-node');
const axios = require('axios');
const fs = require('fs');

// Kubernetes client setup
const kc = new k8s.KubeConfig();
kc.loadFromDefault();
const k8sApi = kc.makeApiClient(k8s.CustomObjectsApi);
const coreV1Api = kc.makeApiClient(k8s.CoreV1Api);
const appsV1Api = kc.makeApiClient(k8s.AppsV1Api);

// Watch for DummySite events
async function watchDummySites() {
  console.log('Starting DummySite controller...');
  
  const stream = await k8sApi.listClusterCustomObject(
    'stable.dwk',
    'v1',
    'dummysites',
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    true
  );

  stream.on('data', async (event) => {
    const { type, object } = event;
    const { metadata, spec } = object;
    const name = metadata.name;
    const namespace = metadata.namespace || 'default';
    const url = spec.website_url;

    console.log(`Event: ${type} - DummySite: ${name}, URL: ${url}`);

    switch (type) {
      case 'ADDED':
        await handleDummySiteAdded(name, namespace, url);
        break;
      case 'DELETED':
        await handleDummySiteDeleted(name, namespace);
        break;
      case 'MODIFIED':
        await handleDummySiteModified(name, namespace, url);
        break;
    }
  });

  stream.on('error', (err) => {
    console.error('Error watching DummySites:', err);
    setTimeout(watchDummySites, 5000); // Reconnect after error
  });
}

async function handleDummySiteAdded(name, namespace, url) {
  console.log(`Creating website for ${name} from ${url}`);
  
  try {
    // 1. Create deployment
    const deployment = {
      apiVersion: 'apps/v1',
      kind: 'Deployment',
      metadata: {
        name: `dummysite-${name}`,
        namespace: namespace,
        labels: { app: 'dummysite', dummysite: name }
      },
      spec: {
        replicas: 1,
        selector: {
          matchLabels: { app: 'dummysite', dummysite: name }
        },
        template: {
          metadata: {
            labels: { app: 'dummysite', dummysite: name }
          },
          spec: {
            containers: [{
              name: 'website',
              image: 'nginx:alpine',
              ports: [{ containerPort: 80 }],
              env: [{ name: 'WEBSITE_URL', value: url }],
              command: ['/bin/sh', '-c'],
              args: [
                `echo "Fetching website from ${url}" && \
                 apk add --no-cache curl && \
                 curl -s ${url} > /usr/share/nginx/html/index.html && \
                 nginx -g 'daemon off;'`
              ]
            }]
          }
        }
      }
    };

    await appsV1Api.createNamespacedDeployment(namespace, deployment);
    console.log(`Deployment created for ${name}`);

    // 2. Create service
    const service = {
      apiVersion: 'v1',
      kind: 'Service',
      metadata: {
        name: `dummysite-${name}-svc`,
        namespace: namespace,
        labels: { app: 'dummysite', dummysite: name }
      },
      spec: {
        type: 'ClusterIP',
        selector: { app: 'dummysite', dummysite: name },
        ports: [{ port: 80, targetPort: 80 }]
      }
    };

    await coreV1Api.createNamespacedService(namespace, service);
    console.log(`Service created for ${name}`);

  } catch (err) {
    console.error(`Error creating resources for ${name}:`, err.body || err.message);
  }
}

async function handleDummySiteDeleted(name, namespace) {
  console.log(`Cleaning up resources for ${name}`);
  
  try {
    // Delete deployment
    await appsV1Api.deleteNamespacedDeployment(`dummysite-${name}`, namespace);
    console.log(`Deleted deployment for ${name}`);
    
    // Delete service
    await coreV1Api.deleteNamespacedService(`dummysite-${name}-svc`, namespace);
    console.log(`Deleted service for ${name}`);
    
  } catch (err) {
    if (err.statusCode !== 404) {
      console.error(`Error cleaning up ${name}:`, err.body || err.message);
    }
  }
}

async function handleDummySiteModified(name, namespace, url) {
  console.log(`Updating ${name} with new URL: ${url}`);
  // For simplicity, delete and recreate
  await handleDummySiteDeleted(name, namespace);
  await handleDummySiteAdded(name, namespace, url);
}

// Start the controller
watchDummySites().catch(console.error);
