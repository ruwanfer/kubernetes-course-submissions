# Exercise 2.9: CronJob for Random Wikipedia Todos

## CronJob Configuration:
- Name: wikipedia-todo-generator
- Schedule: "0 * * * *" (every hour at minute 0)
- Namespace: project

## Script Functionality:
1. Fetches random Wikipedia article from: https://en.wikipedia.org/wiki/Special:Random
2. Follows redirect to get actual article URL
3. Creates todo with text: "Read <Wikipedia-URL>"
4. Posts to todo-backend API at: http://todo-backend-service.project:3002/todos

## Files:
- generate-todo.js: Node.js script
- Dockerfile: Container image definition
- cronjob.yaml: CronJob specification

## Verification:
CronJob is running in "project" namespace:
$ kubectl get cronjobs -n project
