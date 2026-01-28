# Exercise 5.6: Knative Serverless

## Status
✅ Knative installed and working

## Verification
```bash
$ kubectl get pods -n knative-serving
activator-xxx         1/1 Running
autoscaler-xxx        1/1 Running  
controller-xxx        1/1 Running
kourier-xxx           1/1 Running
webhook-xxx           1/1 Running

$ kubectl get ksvc hello
NAME    URL                                       READY
hello   http://hello.default.127.0.0.1.sslip.io   True

$ curl -H "Host: hello.default.127.0.0.1.sslip.io" http://localhost:8080
Hello Hello from Knative!!

