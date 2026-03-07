# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Overview

This is a monorepo containing two related projects for **Alinhadamente** - a Portuguese IT-as-a-Service company:

```
portal-propostas-alinhadamente/
├── portal-propostas-alinhamente/   # Frontend: Interactive proposals portal (React + Vite)
└── payload-multitenant/            # Backend: Payload CMS headless API (Next.js + PostgreSQL)
```

**Business Context:** Alinhadamente provides ongoing digital/IT services to SMBs in Portugal. This platform manages interactive proposals sent to potential clients, presenting services, pricing tiers, and project roadmaps.

## Running Both Projects

### Quick Start

```bash
# Terminal 1: Backend (Payload CMS) - runs on port 3000
cd payload-multitenant
docker compose up -d postgres   # Start ONLY PostgreSQL (not the payload container!)
pnpm install
pnpm dev                        # Run backend LOCALLY, not in Docker

# Terminal 2: Frontend (Proposal Portal) - runs on port 3005
cd portal-propostas-alinhadamente
npm install
npm run dev
```

### ⚠️ IMPORTANT: Docker Setup

The `docker-compose.yml` in `payload-multitenant/` has TWO services:
- `postgres` - PostgreSQL database (**NEEDED** for local dev)
- `payload` - Runs `pnpm dev` inside Docker (**DO NOT USE** for local dev)

**For local development:**
1. Run `docker compose up -d postgres` to start ONLY the database
2. Run `pnpm dev` locally in your terminal (NOT inside Docker)
3. The payload container causes port conflicts and connection issues

**Why?** The `payload` Docker service tries to connect to PostgreSQL using `localhost:5432`, but inside Docker, `localhost` refers to the container itself, not the host machine. Running locally avoids this issue.

## Project Commands

### Frontend (portal-propostas-alinhadamente)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server (port 3005) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |

### Backend (payload-multitenant)

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server (port 3000) |
| `pnpm build` | Build for production |
| `pnpm payload migrate:create` | Create migration after schema changes |
| `pnpm payload migrate` | Apply pending migrations |
| `pnpm payload migrate:status` | Check migration status |
| `pnpm test` | Run all tests (unit + e2e) |
| `pnpm test:int` | Run unit tests (Vitest) |
| `pnpm test:e2e` | Run e2e tests (Playwright) |

## Architecture

### Frontend ↔ Backend Communication

```
┌─────────────────────────────────────┐
│  Frontend (Cloudflare Pages)        │
│  React + Vite + Tailwind            │
│  http://localhost:3005              │
└──────────────┬──────────────────────┘
               │ REST API calls
               ▼
┌─────────────────────────────────────┐
│  Backend (Dokploy on Hetzner)       │
│  Payload CMS + Next.js 15           │
│  http://localhost:3000              │
└──────────────┬──────────────────────┘
               │
               ▼
┌─────────────────────────────────────┐
│  PostgreSQL 17                      │
│  (Docker locally / Dokploy in prod) │
└─────────────────────────────────────┘
```

### Key Integration Points

1. **API Endpoints** (defined in payload-multitenant, consumed by frontend):
   - `GET /api/proposals/public/:slug` - Fetch proposal by slug
   - `GET /api/proposals/public/token/:token` - Fetch proposal by token
   - `POST /api/proposals/public/:slug/accept` - Accept proposal
   - `POST /api/proposals/public/:slug/reject` - Reject proposal

2. **Data Transformation Layer** - The frontend transforms backend responses:

   **Field Naming:**
   | Backend (Payload) | Frontend |
   |-------------------|----------|
   | `setupPrice` | `setup_price` |
   | `monthlyPrice` | `monthly_price` |
   | `hoursSaved` | `hours_saved` |

   **Array Flattening** (Payload stores arrays as objects):
   ```typescript
   // Backend sends:
   features: [{ feature: "Text" }, { feature: "Text 2" }]

   // Frontend expects:
   features: ["Text", "Text 2"]
   ```

   **Files affected:**
   - `portal-propostas-alinhadamente/services/api.ts` - `transformApiProposal()` function
   - `portal-propostas-alinhadamente/types.ts` - TypeScript interfaces

3. **Environment Variables**:

   **Frontend** (`portal-propostas-alinhadamente/.env.local`):
   ```env
   VITE_API_URL=http://localhost:3000
   VITE_DEFAULT_SLUG=marquesevieira
   VITE_USE_MOCK=false
   ```

   **Backend** (`payload-multitenant/.env.local`):
   ```env
   DATABASE_URL=postgresql://payload_dev:dev_password_local@localhost:5432/payload_dev
   PAYLOAD_SECRET=<32-char-secret>
   NEXT_PUBLIC_SERVER_URL=http://localhost:3000
   NODE_ENV=development
   ```

## Critical Patterns

### When Adding New Fields to Backend Collections

1. Update the collection in `payload-multitenant/src/collections/`
2. Run `pnpm payload migrate:create` to generate migration
3. Run `pnpm payload migrate` to apply locally
4. **Update the transformer** in `portal-propostas-alinhadamente/services/api.ts`
5. Update frontend types in `portal-propostas-alinhadamente/types.ts`

### Migration Safety Rules (Backend)

- NEVER edit applied migrations
- NEVER delete migration files
- NEVER modify the database directly with SQL
- ALWAYS run `migrate:create` after schema changes
- ALWAYS commit migration files with schema changes

### Debugging Blank Pages (Frontend)

Usually caused by data structure mismatches:
1. Check browser console for JavaScript errors
2. Look for `.map()` on undefined/non-array data
3. Verify transformer handles new fields correctly

## Troubleshooting

### Port 3000 Already in Use

**Cause:** The Docker `payload` container is running or another process is using port 3000.

**Solution:**
```bash
# Stop the Docker payload container
docker stop payload-multitenant-payload-1
docker rm payload-multitenant-payload-1

# Or kill all node processes (nuclear option)
taskkill //F //IM node.exe  # Windows
pkill -f node               # Linux/Mac

# Then restart
pnpm dev
```

### React Server Components Error

**Error:** `Could not find the module ... in the React Client Manifest`

**Solution:** Clear the Next.js cache and restart:
```bash
cd payload-multitenant
rm -rf .next
pnpm dev
```

### Database Connection Refused

**Error:** `connect ECONNREFUSED 127.0.0.1:5432`

**Cause:** PostgreSQL container is not running.

**Solution:**
```bash
cd payload-multitenant
docker compose up -d postgres
```

### CORS Errors in Frontend

**Error:** `Failed to fetch` or CORS errors in browser console.

**Cause:** Frontend domain not in backend's allowed origins.

**Solution:** Add the domain to `payload-multitenant/src/payload.config.ts` in the `cors` and `csrf` arrays, or set `ALLOWED_ORIGINS` environment variable.

## Key Files

### Backend (payload-multitenant)

| File | Purpose |
|------|---------|
| `src/payload.config.ts` | Main Payload configuration, CORS, plugins |
| `src/collections/Proposals.ts` | Proposal schema definition |
| `src/collections/core/Tenants.ts` | Multi-tenant configuration |
| `src/collections/core/Users.ts` | User roles and auth |
| `docker-compose.yml` | Local PostgreSQL (and payload container - don't use) |
| `.env.local` | Local environment variables |

### Frontend (portal-propostas-alinhadamente)

| File | Purpose |
|------|---------|
| `services/api.ts` | API client and **data transformer** (critical) |
| `types.ts` | TypeScript interfaces |
| `hooks/useProposal.ts` | React hook for fetching proposals |
| `App.tsx` | Main orchestrator, state management |
| `components/PricingTiers.tsx` | Tier selection component |
| `components/Calculator.tsx` | Investment calculator |
| `.env.local` | Local environment variables |

## Detailed Documentation

For comprehensive project-specific guidance, see:
- [portal-propostas-alinhadamente/CLAUDE.md](portal-propostas-alinhadamente/CLAUDE.md) - Frontend architecture, components, API integration
- [payload-multitenant/CLAUDE.md](payload-multitenant/CLAUDE.md) - Backend collections, multi-tenant setup, deployment

## Tech Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend Framework | React 19 + Vite 6 |
| Frontend Styling | Tailwind CSS |
| Backend CMS | Payload CMS 3.x |
| Backend Framework | Next.js 15 |
| Database | PostgreSQL 17 |
| ORM | Drizzle (via Payload adapter) |
| Multi-tenancy | @payloadcms/plugin-multi-tenant |
| Package Manager | npm (frontend) / pnpm (backend) |
