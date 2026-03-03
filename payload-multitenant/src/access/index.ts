import type { Access, FieldAccess } from 'payload'

/**
 * Check if user is super admin
 * Super admins have full access to all tenants and collections
 */
export const isSuperAdmin: Access = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'superAdmin'
}

/**
 * Check if user belongs to Alinhadamente tenant
 * This is for shared resources that only Alinhadamente should manage
 */
export const isAlinhadamenteTenant: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true

  // Check if user's tenant is "alinhadamente"
  // The tenant field is populated by the multi-tenant plugin
  const tenant = user.tenants?.[0]
  if (!tenant) return false

  // Handle both populated and unpopulated tenant
  const tenantSlug = typeof tenant === 'object' ? tenant.slug : tenant
  return tenantSlug === 'alinhadamente'
}

/**
 * Combined check: super admin OR Alinhadamente tenant
 * Use this for shared components (motores, addons, etc.)
 */
export const isSuperAdminOrAlinhadamente: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true

  const tenant = user.tenants?.[0]
  if (!tenant) return false

  const tenantSlug = typeof tenant === 'object' ? tenant.slug : tenant
  return tenantSlug === 'alinhadamente'
}

/**
 * Field-level access for super admin only
 */
export const superAdminOnlyField: FieldAccess = ({ req: { user } }) => {
  if (!user) return false
  return user.role === 'superAdmin'
}

/**
 * Read access for all authenticated users, write for super admin only
 * Use this for collections that should be visible but not editable by tenants
 */
export const readOnlyForTenants: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true

  // For read operations, allow all authenticated users
  // The collection-level access will still filter by tenant
  return true
}

/**
 * Check if user can manage proposals
 * Super admin, tenant admins, and tenant editors can manage
 */
export const canManageProposals: Access = ({ req: { user } }) => {
  if (!user) return false
  if (user.role === 'superAdmin') return true

  return ['tenantAdmin', 'tenantEditor'].includes(user.role)
}

/**
 * Check if user can view proposals
 * All authenticated users can view
 */
export const canViewProposals: Access = ({ req: { user } }) => {
  return !!user
}
