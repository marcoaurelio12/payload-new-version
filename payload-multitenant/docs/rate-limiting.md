# Rate Limiting Configuration

This document describes how to configure rate limiting for the Payload CMS API to prevent brute force attacks and DoS.

## Why Rate Limiting is Critical

Without rate limiting, attackers can:
- Brute force access codes (`accessPass`) on proposals
- Brute force login credentials
- Exhaust server resources (DoS)

## Option 1: Traefik/Dokploy Middleware (Recommended)

If using Dokploy with Traefik, add rate limiting at the reverse proxy level.

### Step 1: Create a middleware in Traefik

In your `docker-compose.yml` or Traefik dynamic configuration:

```yaml
http:
  middlewares:
    # Strict rate limit for auth endpoints
    auth-ratelimit:
      rateLimit:
        average: 5          # 5 requests per...
        period: 15m         # 15 minutes
        burst: 10           # Allow brief spikes

    # General API rate limit
    api-ratelimit:
      rateLimit:
        average: 100        # 100 requests per...
        period: 1m          # 1 minute
        burst: 150

    # Proposal verify endpoint (very strict - prevents brute force)
    verify-ratelimit:
      rateLimit:
        average: 10         # 10 requests per...
        period: 15m         # 15 minutes
        burst: 15
```

### Step 2: Apply middleware to routes

In your Dokploy service configuration, add labels:

```yaml
labels:
  # Apply strict rate limiting to auth endpoints
  - "traefik.http.routers.payload-api.middlewares=auth-ratelimit@file"

  # Apply to specific sensitive paths via router rules
  - "traefik.http.routers.payload-verify.rule=PathPrefix(`/api/proposals/public/`) && PathSuffix(`/verify`)"
  - "traefik.http.routers.payload-verify.middlewares=verify-ratelimit@file"
```

## Option 2: Cloudflare Rate Limiting

If using Cloudflare as a CDN/proxy:

### Step 1: Go to Cloudflare Dashboard
1. Navigate to your domain
2. Go to **Security** > **WAF**
3. Click **Create rate limiting rule**

### Step 2: Create rules

**Rule 1: Login Protection**
```
If: URI Path contains "/api/users/login"
AND: Request Method is "POST"
Then: Rate limit to 5 requests per 1 minute per IP
Action: Block for 15 minutes
```

**Rule 2: Proposal Access Protection**
```
If: URI Path matches "/api/proposals/public/*/verify"
AND: Request Method is "POST"
Then: Rate limit to 10 requests per 15 minutes per IP
Action: Block for 30 minutes
```

**Rule 3: General API Protection**
```
If: URI Path starts with "/api/"
Then: Rate limit to 100 requests per 1 minute per IP
Action: Managed Challenge
```

## Option 3: Application-Level (Express Middleware)

If you need application-level rate limiting, you can add it to the Payload config.

### Install dependencies

```bash
pnpm add express-rate-limit
```

### Create rate limiter utility

Create `src/lib/rateLimiter.ts`:

```typescript
import rateLimit from 'express-rate-limit';

// Strict limiter for authentication endpoints
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  skipSuccessfulRequests: true, // Don't count successful logins
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Limiter for proposal access verification
export const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  skipSuccessfulRequests: true,
  message: { error: 'Too many attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false,
});

// General API limiter
export const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests per minute
  message: { error: 'Too many requests, please slow down' },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### Apply to endpoints

In `src/collections/Proposals.ts`, you can wrap the handlers:

```typescript
import { verifyLimiter } from '../lib/rateLimiter';

// In your endpoint definition:
{
  path: '/public/:slug/verify',
  method: 'post',
  handler: async (req) => {
    // Apply rate limiting manually (since Payload doesn't support middleware directly)
    // Note: This is a simplified example - consider using Traefik/Cloudflare instead

    const slug = req.routeParams?.slug as string | undefined;
    // ... rest of handler
  },
}
```

> **Note:** Application-level rate limiting is harder to implement in Payload CMS because custom endpoints don't support Express middleware natively. Using Traefik or Cloudflare is recommended.

## Recommended Configuration

| Endpoint | Limit | Window | Burst | Block Duration |
|----------|-------|--------|-------|----------------|
| `/api/users/login` | 5 | 15 min | 5 | 15 min |
| `/api/proposals/public/*/verify` | 10 | 15 min | 15 | 30 min |
| `/api/proposals/public/*/accept` | 5 | 15 min | 5 | 15 min |
| `/api/proposals/public/*/reject` | 5 | 15 min | 5 | 15 min |
| `/api/*` (general) | 100 | 1 min | 150 | 5 min |

## Monitoring

After implementing rate limiting, monitor:

1. **Rate limit hits** - Check Traefik/Cloudflare logs for blocked requests
2. **Failed login attempts** - Should decrease significantly
3. **Unusual IP patterns** - Multiple IPs from same range may indicate distributed attack

## Testing

Test your rate limiting:

```bash
# Should be blocked after 5 attempts
for i in {1..10}; do
  curl -X POST https://cms.alinhadamente.pt/api/proposals/public/test-slug/verify \
    -H "Content-Type: application/json" \
    -d '{"accessPass":"WRONG"}' \
    -w "\nStatus: %{http_code}\n"
done
```
