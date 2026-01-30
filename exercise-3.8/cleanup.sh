#!/bin/bash
# Delete namespace for deleted branch
BRANCH=$1
NAMESPACE=$(echo "$BRANCH" | tr '/' '-')
kubectl delete namespace $NAMESPACE
