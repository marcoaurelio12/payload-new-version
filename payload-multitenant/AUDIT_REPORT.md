# Project Audit Report: Payload Multitenant vs CLAUDE.md

**Audit Date:** 2026-02-13
**Project:** payload-multitenant
**Reference:** CLAUDE.md specifications

---

## Executive Summary

The project is in **early development phase**. While the foundation is partially established, significant gaps exist between the documented specifications and current implementation.

---

## What's Implemented Correctly

### Core Infrastructure

| Spec | Status | Notes |
|------|--------|-------|
| Payload CMS 3.x | ✅ | v3.76.1 installed |
| Next.js 15 | ✅ | v15.4.11 installed |
| PostgreSQL adapter | ✅ | `@payloadcms/db-postgres` |
| Lexical editor | ✅ | `@payloadcms/richtext-lexical` |
| Multi-tenant plugin | ✅ | `@payloadcms/plugin-multi-tenant` |
| TypeScript strict mode | ✅ | Enabled in tsconfig.json |
| Docker standalone output | ✅ | Configured in next.config.mjs |

### Collections Implemented

- [x] **Users** - Basic auth collection exists
- [x] **Tenants** - Basic structure with name, slug, domain, logo, active
- [x] **Media** - Basic upload collection
- [x] **Posts** - With slug auto-generation, SEO meta, categories
- [x] **Categories** - With slug auto-generation
- [x] **Pages** - Basic page structure
- [x] **SiteConfig** - Comprehensive per-tenant configuration

---

## Missing / Incomplete Items

### 1. Users Collection - Major Gaps

**Missing Fields:**

| Field | CLAUDE.md Spec |
|-------|----------------|
| `role` | `superAdmin \| tenantAdmin \| tenantEditor \| tenantViewer` |
| `tenants` | Array of relationships to tenants user has access to |
| `activeTenant` | Currently selected tenant |
| `avatar` | Upload to media |

**Missing Auth Config:**

| Config | Spec |
|--------|------|
| `useAPIKey: true` | For integrations |
| `tokenExpiration: 7200` | 2 hours |
| `maxLoginAttempts: 5` | Rate limiting |
| `lockTime: 600000` | 10 min lockout |
| Access control functions | Per-role permissions |

### 2. Tenants Collection - Missing Fields

| Missing Field | CLAUDE.md Spec |
|---------------|----------------|
| `plan` | `starter \| professional \| enterprise` |
| `features` | JSON list of enabled modules |
| `settings` group | `primaryColor`, `companyEmail`, `companyPhone` |
| Access control | Only superAdmin can create, etc. |

### 3. Media Collection - Missing Config

| Missing | Spec |
|---------|------|
| `caption` field | Optional text field |
| MIME type validation | `image/*`, `application/pdf` only |
| Max file size | 10MB limit |
| Image sizes | thumbnail (300x300), medium (800x600), large (1920x1080), og (1200x630) |
| S3 storage | Wasabi integration not configured |

### 4. Missing Collections - Portal de Propostas (Phase 2)

| Collection | Status |
|------------|--------|
| `Proposals` | ❌ Not implemented |
| `ProposalTemplates` | ❌ Not implemented |
| `Tags` | ❌ Not implemented (mentioned in CLAUDE.md) |

### 5. Missing Directories

```
src/access/      ❌ No access control functions (tenantIsolation, isSuperAdmin, etc.)
src/hooks/       ❌ No reusable hooks (assignTenantOnCreate, etc.)
src/blocks/      ❌ No Lexical blocks (PricingCalculator, ServiceSelector, etc.)
src/lib/         ❌ No utility functions (constants, utils)
src/globals/     ❌ No global configs (SiteSettings mentioned in spec)
```

### 6. Configuration Issues

#### CORS/CSRF Not Configured

`src/payload.config.ts` is missing:

```typescript
// MISSING:
cors: [
  'https://alinhadamente.pt',
  'https://www.alinhadamente.pt',
  'https://propostas.alinhadamente.pt',
  // Add client domains as needed
],
csrf: [
  'https://alinhadamente.pt',
  'https://www.alinhadamente.pt',
  'https://propostas.alinhadamente.pt',
],
```

#### S3 Storage Not Configured

Missing `@payloadcms/storage-s3` plugin installation and Wasabi configuration.

#### Dockerfile Issues

`Dockerfile`:

- ❌ Doesn't run migrations before start (spec requires: `pnpm payload migrate && pnpm start`)
- ❌ Missing migrations folder copy
- ❌ Uses `node:22` instead of `node:20` (minor deviation from spec)
- ❌ User is `nextjs` instead of `payload`

#### docker-compose.yml Issues

`docker-compose.yml`:

- ❌ Uses MongoDB as default (should be PostgreSQL only)
- ❌ PostgreSQL is commented out
- ❌ Node 18 image instead of 20
- ❌ Missing proper PostgreSQL 17 alpine setup per spec

### 7. Security Headers Missing

`next.config.mjs` lacks security headers:

```javascript
// MISSING:
async headers() {
  return [
    {
      source: '/:path*',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-XSS-Protection', value: '1; mode=block' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
        // Content-Security-Policy should be added
      ],
    },
  ]
},
```

### 8. .env.example Issues

Current `.env.example`:

- ✅ Has `DATABASE_URL`
- ✅ Has `PAYLOAD_SECRET`
- ✅ Has `NEXT_PUBLIC_SERVER_URL`
- ❌ Missing `S3_BUCKET`
- ❌ Missing `S3_REGION`
- ❌ Missing `S3_ENDPOINT`
- ❌ Missing `S3_ACCESS_KEY`
- ❌ Missing `S3_SECRET_KEY`
- ❌ Missing `ALLOWED_ORIGINS` (for CORS via env var)

### 9. Multi-Tenant Plugin Configuration Issue

`src/payload.config.ts` (lines 52-56):

```typescript
userHasAccessToAllTenants: (user) => {
  // For now, return false to enforce tenant isolation
  return false  // ❌ No superAdmin check!
}
```

**Should be:**

```typescript
userHasAccessToAllTenants: (user) => {
  return user?.role === 'superAdmin'
}
```

This is a **critical security issue** - super admins cannot access all tenants.

---

## Compliance Summary

| Category | Status | Completion |
|----------|--------|------------|
| **Phase 1 - Foundation** | 🟡 Partial | ~40% |
| **Phase 2 - Proposals** | 🔴 Not Started | 0% |
| **Phase 3 - Content** | 🟡 Partial | ~60% |
| **Security** | 🔴 Critical Gaps | ~20% |
| **Docker/Deploy** | 🟡 Needs Work | ~50% |
| **Access Control** | 🔴 Not Implemented | 0% |

---

## Critical Priority Fixes

1. **Add role field to Users** - Essential for multi-tenant access control
2. **Fix multi-tenant superAdmin check** - Security issue
3. **Implement access control functions** in `src/access/`
4. **Update docker-compose.yml** to use PostgreSQL (remove MongoDB)
5. **Add CORS/CSRF configuration** for frontend domains
6. **Fix Dockerfile** to run migrations on startup

---

## Recommended Next Steps

### Immediate (Security)

- [ ] Add `role` field to Users collection
- [ ] Fix `userHasAccessToAllTenants` to check superAdmin role
- [ ] Create `src/access/` directory with access control functions

### Short-term (Core Functionality)

- [ ] Complete Users collection with tenants array and activeTenant
- [ ] Add missing fields to Tenants (plan, features, settings)
- [ ] Add caption field and image sizes to Media
- [ ] Update docker-compose.yml for PostgreSQL 17

### Medium-term (Features)

- [ ] Install and configure `@payloadcms/storage-s3` for Wasabi
- [ ] Add CORS/CSRF configuration to payload.config.ts
- [ ] Add security headers to next.config.mjs
- [ ] Implement Proposals module (Phase 2)
- [ ] Create Tags collection

### Before Production

- [ ] Implement rate limiting
- [ ] Add comprehensive access control tests
- [ ] Configure SSL and security hardening
- [ ] Set up backup verification

---

## Files Requiring Changes

| File | Issue | Priority |
|------|-------|----------|
| `src/collections/Users.ts` | Missing role, tenants, access control | 🔴 Critical |
| `src/payload.config.ts` | Missing CORS, CSRF, superAdmin check | 🔴 Critical |
| `src/collections/Tenants.ts` | Missing plan, features, settings | 🟡 Medium |
| `src/collections/Media.ts` | Missing caption, image sizes, S3 | 🟡 Medium |
| `Dockerfile` | Missing migration step | 🟠 High |
| `docker-compose.yml` | Wrong database (Mongo vs Postgres) | 🟠 High |
| `next.config.mjs` | Missing security headers | 🟠 High |
| `.env.example` | Missing S3 vars | 🟢 Low |

---

*Report generated by Claude Code audit*
