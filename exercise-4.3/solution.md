# Exercise 4.3: Prometheus Query Solution

## Query:
count(kube_pod_info{namespace="prometheus", created_by_kind="StatefulSet"})

## Steps:
1. Port-forward to Prometheus UI
2. Enter the query
3. Result should be 3
