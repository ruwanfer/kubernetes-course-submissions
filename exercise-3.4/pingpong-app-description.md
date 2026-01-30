# Ping-pong Application Requirements

## Current Implementation
- Listens on port 80
- Handles all paths at root level
- Returns "pong" for any request
- Simple nginx configuration

## Why Root Path Only?
1. **Simplicity**: App focuses on business logic (counting pongs)
2. **Portability**: Can be deployed anywhere without path dependencies
3. **Testability**: Easier to test with simple root path
4. **Maintainability**: No routing logic in application code

## Deployment Requirements
- Service name: `pingpong-service`
- Port: 80
- Path handling: Root path only (`/`)
- Response: "pong" (plain text)

## Gateway API Integration
- External path: `/pingpong`
- Internal path: `/` (after rewrite)
- URL Rewrite: `/pingpong` → `/`
