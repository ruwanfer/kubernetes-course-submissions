# Exercise 2.10: Request Logging and Backend Validation

## Changes Implemented:
1. **Structured JSON Logging** - All requests and events logged as JSON
2. **Request Logging Middleware** - Logs method, URL, status, duration, userAgent
3. **Backend Validation** - Enforces 140-character limit server-side
4. **Event-based Logging** - Specific events for todo creation attempts/successes/rejections

## Log Events:
- `server_start`: Backend startup
- `create_todo_attempt`: Todo creation attempt (logs text length/preview)
- `create_todo_success`: Successful todo creation
- `create_todo_rejected`: Failed creation with reason (`too_long` or `empty_text`)
- `get_todos`: When todos are retrieved

## Validation:
- Todos > 140 characters are rejected with HTTP 400
- Empty todos are rejected with HTTP 400
- Response includes error details and length information

## Test Results (in log-output.txt):
✅ Valid todo (15 chars) - Accepted  
✅ Too long todo (169 chars) - Rejected with "too_long" reason  
✅ Empty todo - Rejected with "empty_text" reason
