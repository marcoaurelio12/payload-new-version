import type { CollectionConfig, User as PayloadUser } from 'payload'
import { isSuperAdmin } from '../access'

// Extend Payload User type with our custom fields
type UserWithRole = PayloadUser & {
  role?: 'superAdmin' | 'tenantAdmin' | 'tenantEditor' | 'tenantViewer'
}

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
    group: 'System',
  },
  auth: {
    // Enable API keys for server-side frontend authentication
    useAPIKey: true,
    // Token expiration (2 hours)
    tokenExpiration: 7200,
    // Max login attempts before lockout
    maxLoginAttempts: 5,
    // Lockout duration (10 minutes)
    lockTime: 600000,
  },
  access: {
    // Allow creation if:
    // 1. No users exist yet (first user setup)
    // 2. User is super admin
    create: async ({ req }) => {
      // If no user is logged in, check if any users exist
      if (!req.user) {
        const users = await req.payload.find({
          collection: 'users',
          limit: 0,
          overrideAccess: true,
        })
        // Allow if no users exist (first user setup)
        return users.totalDocs === 0
      }
      // Otherwise, require super admin
      return isSuperAdmin({ req })
    },
    // Users can read their own data, super admins can read all
    read: ({ req: { user } }) => {
      if (!user) return false
      const typedUser = user as UserWithRole
      if (typedUser.role === 'superAdmin') return true
      return { id: { equals: user.id } }
    },
    // Users can update their own data, super admins can update all
    update: ({ req: { user } }) => {
      if (!user) return false
      const typedUser = user as UserWithRole
      if (typedUser.role === 'superAdmin') return true
      return { id: { equals: user.id } }
    },
    // Only super admins can delete users
    delete: isSuperAdmin,
  },
  fields: [
    // Email added by default
    {
      name: 'firstName',
      type: 'text',
      admin: {
        description: 'User first name for personalized greetings',
      },
    },
    {
      name: 'lastName',
      type: 'text',
      admin: {
        description: 'User last name',
      },
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'tenantViewer',
      options: [
        { label: 'Super Admin', value: 'superAdmin' },
        { label: 'Tenant Admin', value: 'tenantAdmin' },
        { label: 'Tenant Editor', value: 'tenantEditor' },
        { label: 'Tenant Viewer', value: 'tenantViewer' },
      ],
      admin: {
        position: 'sidebar',
        description: 'User role determines access level',
      },
    },
    {
      name: 'avatar',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'User avatar',
      },
    },
    {
      name: 'onboarding',
      type: 'group',
      admin: {
        description: 'User onboarding state tracking',
      },
      fields: [
        {
          name: 'hasSeenWelcome',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Whether the user has seen the initial welcome page',
          },
        },
        {
          name: 'welcomeSeenAt',
          type: 'date',
          admin: {
            description: 'Timestamp when welcome was first shown',
          },
        },
      ],
    },
  ],
}
