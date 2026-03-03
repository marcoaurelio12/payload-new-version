import type { CollectionAfterChangeHook, CollectionAfterDeleteHook } from 'payload'

/**
 * Get the deploy hook URL for a tenant from environment variables.
 * Format: CF_DEPLOY_HOOK_{TENANT_SLUG} where slug is uppercased with hyphens replaced by underscores.
 *
 * Example: advogados-silva → CF_DEPLOY_HOOK_ADVOGADOS_SILVA
 */
function getDeployHookUrl(tenantSlug: string): string | null {
  const envKey = `CF_DEPLOY_HOOK_${tenantSlug.toUpperCase().replace(/-/g, '_')}`
  return process.env[envKey] || null
}

/**
 * Trigger a rebuild on Cloudflare Pages for the specified tenant.
 */
async function triggerRebuild(tenantSlug: string, operation: string): Promise<void> {
  const hookUrl = getDeployHookUrl(tenantSlug)

  if (!hookUrl) {
    console.log(`[Webhook] No deploy hook configured for tenant: ${tenantSlug}`)
    return
  }

  console.log(`[Webhook] Triggering rebuild for ${tenantSlug} (${operation})`)

  try {
    const response = await fetch(hookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (response.ok) {
      console.log(`[Webhook] ✅ Rebuild triggered successfully for: ${tenantSlug}`)
    } else {
      console.error(`[Webhook] ❌ Rebuild failed for ${tenantSlug}: HTTP ${response.status}`)
    }
  } catch (error) {
    console.error(`[Webhook] ❌ Error triggering rebuild for ${tenantSlug}:`, error)
  }
}

/**
 * Extract tenant slug from a document.
 * The tenant field may be populated (object with slug) or just an ID.
 */
function getTenantSlug(doc: Record<string, unknown>): string | null {
  if (!doc.tenant) return null

  // If tenant is populated as an object with slug
  if (typeof doc.tenant === 'object' && doc.tenant !== null) {
    const tenant = doc.tenant as Record<string, unknown>
    return (tenant.slug as string) || null
  }

  // If tenant is just an ID, we can't get the slug without a query
  // In this case, return null (tenant should be populated via depth parameter)
  return null
}

/**
 * Check if a document should trigger a rebuild.
 * Only published content triggers rebuilds.
 */
function shouldTriggerRebuild(
  doc: Record<string, unknown>,
  previousDoc?: Record<string, unknown>
): boolean {
  const status = doc.status as string | undefined
  const previousStatus = previousDoc?.status as string | undefined

  // If document has a status field
  if (status !== undefined) {
    // Trigger if currently published
    if (status === 'published') return true

    // Trigger if was published and now is not (to remove from site)
    if (previousStatus === 'published' && status !== 'published') return true

    return false
  }

  // If no status field, always trigger (for collections without status)
  return true
}

/**
 * After change hook to trigger Cloudflare rebuild when content is published/updated.
 */
export const afterContentChange: CollectionAfterChangeHook = async ({
  doc,
  previousDoc,
  operation,
}) => {
  // Skip for new drafts that aren't published
  if (operation === 'create' && doc.status && doc.status !== 'published') {
    return doc
  }

  // Check if we should trigger a rebuild
  if (!shouldTriggerRebuild(doc, previousDoc as Record<string, unknown> | undefined)) {
    return doc
  }

  const tenantSlug = getTenantSlug(doc)
  if (!tenantSlug) {
    console.log('[Webhook] Could not determine tenant slug, skipping rebuild')
    return doc
  }

  // Trigger rebuild asynchronously (don't block the response)
  void triggerRebuild(tenantSlug, operation)

  return doc
}

/**
 * After delete hook to trigger Cloudflare rebuild when content is deleted.
 */
export const afterContentDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  // Only trigger rebuild if the document was published
  if (doc.status && doc.status !== 'published') {
    return doc
  }

  const tenantSlug = getTenantSlug(doc)
  if (!tenantSlug) {
    console.log('[Webhook] Could not determine tenant slug, skipping rebuild')
    return doc
  }

  // Trigger rebuild asynchronously
  void triggerRebuild(tenantSlug, 'delete')

  return doc
}
