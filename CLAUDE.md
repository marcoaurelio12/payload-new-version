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

```bash
# Terminal 1: Backend (Payload CMS) - runs on port 3000
cd payload-multitenant
docker compose up -d          # Start PostgreSQL locally
pnpm install
pnpm dev

# Terminal 2: Frontend (Proposal Portal) - runs on port 3005
cd portal-propostas-alinhadamente
npm install
npm run dev
```

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
   - Backend uses camelCase (`setupPrice`, `monthlyPrice`)
   - Frontend expects snake_case (`setup_price`, `monthly_price`)
   - Array structures are flattened: `[{ feature: "text" }]` → `["text"]`
   - See `portal-propostas-alinhadamente/services/api.ts` for transformer

3. **Environment Variables**:
   - Frontend: `VITE_API_URL=http://localhost:3000`
   - Backend: See `payload-multitenant/.env.example`

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
