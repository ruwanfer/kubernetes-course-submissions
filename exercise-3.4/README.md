# Exercise 3.4: Rewritten Routing

Implemented path rewriting with Gateway API to decouple external URL structure from application code.

## Problem
- Applications shouldn't need to know about cluster-level URL structures
- Ping-pong app was accessible at `/pingpong` path
- Hardcoded paths reduce application portability

## Solution
Used Gateway API's `URLRewrite` filter with `replacePrefixMatch` to:
1. **External URL**: `/pingpong` (what clients see)
2. **Internal rewrite**: `/` (what application receives)
3. **Application**: Only handles root path, unaware of external routing

## Implementation

### 1. Application Layer
- Ping-pong app simplified to handle only root path `/`
- Returns "pong" for any request to root
- No knowledge of external `/pingpong` path

### 2. Gateway API Layer
- HTTPRoute with `URLRewrite` filter
- Rewrites `/pingpong` → `/` before forwarding to application
- Uses `replacePrefixMatch` (GKE-compatible, unlike `replaceFullPath`)

### 3. Key Configuration
\`\`\`yaml
filters:
- type: URLRewrite
  urlRewrite:
    path:
      type: ReplacePrefixMatch
      replacePrefixMatch: /
\`\`\`

## Architecture
\`\`\`
Client Request:   GET /pingpong
                  ↓
Gateway:          Route match: /pingpong
                  ↓  
URL Rewrite:      /pingpong → /
                  ↓
Application:      Receives: GET /
                  Returns: "pong"
\`\`\`

## Benefits
1. **Decoupling**: App doesn't depend on external URL structure
2. **Portability**: Same app can be exposed at different paths
3. **Flexibility**: Change routes without modifying application code
4. **Simplicity**: App only handles business logic, not routing concerns

## Testing
Without rewrite: App would need to handle `/pingpong` path
With rewrite: App only handles `/` path, Gateway manages routing

## Files
- \`httproute-pingpong-rewrite.yaml\` - HTTPRoute with path rewrite configuration
- \`pingpong-app-description.md\` - Application requirements
