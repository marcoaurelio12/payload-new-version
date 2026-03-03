# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is Alinhadamente's **Proposal Portal** - a platform where small and medium businesses in Portugal can view personalized proposals for digital/IT services.

Alinhadamente positions itself as an external digital/IT department for SMBs, offering services like website development, automations, and ongoing digital support. Each proposal is customized per client and presents:
- The scope of work and deliverables
- Pricing tiers and add-on options
- Project roadmap with mutual responsibilities
- Team and social proof

The portal has two presentation modes: a full "Complete" experience and a streamlined "Express" version for quick decision-making.

## Development Commands

```bash
# Install dependencies
npm install

# Start development server (runs on port 3005)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Setup

Create a `.env.local` file with:
```env
# API Configuration - Backend Payload CMS
VITE_API_URL=http://localhost:3000

# Default proposal slug to load (optional)
VITE_DEFAULT_SLUG=marquesevieira

# Use mock data instead of API (true/false)
VITE_USE_MOCK=false

# Other keys
GEMINI_API_KEY=your_api_key_here
```

## Backend Integration

This frontend connects to a **Payload CMS** backend located at `../payload-multitenant/`.

### API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/proposals/public/:slug` | GET | Fetch proposal by slug |
| `/api/proposals/public/token/:token` | GET | Fetch proposal by token |
| `/api/proposals/public/:slug/accept` | POST | Accept proposal |
| `/api/proposals/public/:slug/reject` | POST | Reject proposal |

### Data Transformation Layer

**CRITICAL**: The backend (Payload CMS) and frontend use different data structures. The transformer in `services/api.ts` handles this conversion.

#### Field Naming Convention Mismatch

| Backend (Payload) | Frontend |
|-------------------|----------|
| `setupPrice` | `setup_price` |
| `monthlyPrice` | `monthly_price` |
| `hoursSaved` | `hours_saved` |
| `retentionBoost` | `retention_boost` |

#### Nested Array Structures

Payload CMS stores array items as objects. The transformer flattens them:

```typescript
// Backend sends:
features: [{ feature: "Text" }, { feature: "Text 2" }]

// Frontend expects:
features: ["Text", "Text 2"]
```

This applies to:
- `pricing.tiers[].features` → `[{ feature: string }]` → `string[]`
- `roadmapPhases[].agencyTasks` → `[{ task: string }]` → `string[]`
- `roadmapPhases[].clientTasks` → `[{ task: string }]` → `string[]`
- `includedItems[].features` → `[{ featureText: string }]` → `string[]`

### Key Files for API Integration

- [services/api.ts](services/api.ts) - API client and data transformer
- [hooks/useProposal.ts](hooks/useProposal.ts) - React hook for fetching proposals
- [types.ts](types.ts) - Frontend TypeScript interfaces

### URL Structure for Proposals

The app detects slugs from URL patterns:
- `/:slug` - Root level slug
- `/o/:slug` - With /o/ prefix
- `/proposal/:slug` - With /proposal/ prefix

## Architecture

### Version System
The app has two proposal presentation modes:
- **Complete**: Full multi-section proposal with diagnostics, roadmap, team, FAQ, etc.
- **Express**: Condensed single-page variant optimized for quick decision-making

Version state is managed in [App.tsx](App.tsx) via `proposalVersion` state and persisted to localStorage.

### Page Navigation
Two main pages controlled by `currentPage` state:
- `proposal`: The main proposal view
- `onboarding`: Client onboarding flow

### Key Files
- [App.tsx](App.tsx) - Main application orchestrator with version switching, analytics hooks, and pricing calculations
- [types.ts](types.ts) - TypeScript interfaces for Proposal, AddOn, PricingTier, etc.
- [services/api.ts](services/api.ts) - API client for Payload CMS backend and data transformer
- [hooks/useProposal.ts](hooks/useProposal.ts) - React hook for fetching proposals with fallback to mock data
- [components/ProposalExpress.tsx](components/ProposalExpress.tsx) - Express version wrapper component

### Component Structure
```
components/
├── express/           # Express-version specific components
│   ├── HeaderExpress.tsx
│   ├── HeroExpress.tsx
│   ├── TrustBarExpress.tsx
│   ├── DiagnosticSwiper.tsx
│   ├── IncludedAccordion.tsx
│   ├── PricingExpress.tsx
│   ├── CTAFinal.tsx
│   └── StickyBottomBar.tsx
├── Header.tsx         # Main navigation
├── Hero.tsx           # Hero section
├── TrustBar.tsx       # Trust indicators
├── DiagnosticSection.tsx
├── PricingTiers.tsx   # Tier selection (Essencial/Alinhado/Premium)
├── Calculator.tsx     # Investment calculator with add-ons
├── Roadmap.tsx        # Project phases
├── CmsMotors.tsx      # CMS feature modules
├── ROISection.tsx
├── FAQSection.tsx
├── TeamSection.tsx
├── TestimonialsSection.tsx
├── ChatWidget.tsx     # Floating contact widget
├── Token.tsx          # Tokenized content replacement
└── ...
```

### State Management
- No external state library - uses React useState/useEffect
- Selected tier and add-ons managed in App.tsx, passed down to Calculator/PricingTiers
- Viewer tracking via localStorage (`viewer_id`, `proposal_view_preference`)

### Analytics
The `useSectionTracking` hook in App.tsx uses IntersectionObserver to track time spent in each section.

## Tech Stack

- React 19.0.0
- TypeScript 5.8.2
- Vite 6.2.0
- Framer Motion 11.11.17 (animations)
- Heroicons 2.2.0 (icons)
- Tailwind CSS (via CDN in index.html)

## Path Aliases

`@/*` maps to the root directory (configured in tsconfig.json and vite.config.ts).

## Important Patterns & Gotchas

### When Adding New Fields from Backend

1. **Always update the transformer** in `services/api.ts` - never assume backend data matches frontend types
2. **Check field naming**: Backend uses camelCase, frontend uses snake_case for some fields
3. **Check array structures**: Payload arrays of objects need to be flattened

### When Page Goes Blank

This usually means a JavaScript error in a component. Check:
1. Browser console for errors
2. Data structure mismatches (especially `.map()` on non-arrays)
3. Missing null checks on optional fields

### Development vs Production Data

- In development mode (`import.meta.env.DEV`), failed API calls fall back to mock data
- In production, failed API calls show an error message
- Set `VITE_USE_MOCK=true` to force mock data usage

### Running Both Projects

```bash
# Terminal 1: Backend (Payload CMS)
cd ../payload-multitenant
pnpm dev

# Terminal 2: Frontend (this project)
npm run dev
```
