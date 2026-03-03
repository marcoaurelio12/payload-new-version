import { postgresAdapter } from '@payloadcms/db-postgres'
import { multiTenantPlugin } from '@payloadcms/plugin-multi-tenant'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

// Core collections
import { Categories } from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { SiteConfig } from './collections/SiteConfig'
import { Tenants } from './collections/Tenants'
import { Users } from './collections/Users'

// Proposal collections
import { Addons } from './collections/Addons'
import { FAQs } from './collections/FAQs'
import { Motores } from './collections/Motores'
import { Proposals } from './collections/Proposals'
import { ProposalTemplates } from './collections/ProposalTemplates'
import { Team } from './collections/Team'
import { Testimonials } from './collections/Testimonials'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// Allowed origins for CORS (dev + production)
// Production origins - always included
const productionOrigins = [
  'https://portal-propostas-alinhadamente.pages.dev',
  'https://cms.alinhadamente.pt',
  // Additional origins from env var
  ...(process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map((origin) => origin.trim())
    : []),
]

const devOrigins =
  process.env.NODE_ENV === 'development'
    ? [
        'http://localhost:3000',
        'http://localhost:3001',
        'http://localhost:3005', // Frontend Vite
        'http://localhost:4321', // Astro
      ]
    : []

const allowedOrigins = [...devOrigins, ...productionOrigins]

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  // CORS configuration for frontend connections
  cors: allowedOrigins,
  // CSRF protection
  csrf: allowedOrigins,
  collections: [
    // Core
    Users,
    Media,
    Tenants,
    Pages,
    Posts,
    Categories,
    SiteConfig,
    // Proposals
    Proposals,
    ProposalTemplates,
    Motores,
    Addons,
    Testimonials,
    Team,
    FAQs,
  ],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    multiTenantPlugin({
      // Collections that should be tenant-scoped
      // The plugin will automatically add a tenant field to these collections
      collections: {
        // Content collections (tenant-scoped)
        pages: {},
        posts: {},
        categories: {},
        media: {},
        // Proposals (tenant-scoped)
        proposals: {},
        // Site config behaves as a global per tenant
        'site-config': {
          isGlobal: true,
        },
        // Shared components (motores, addons, testimonials, team, faqs, proposal-templates)
        // are NOT included here - they are managed by access control only
      } as Record<string, { isGlobal?: boolean }>,
      // Users who match this function can access all tenants (super admins)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      userHasAccessToAllTenants: (user: any) => {
        // Super admins can access all tenants
        return user?.role === 'superAdmin'
      },
      // Show tenant field in admin for debugging (set to false in production)
      debug: process.env.NODE_ENV === 'development',
    } as any),
  ],
})
