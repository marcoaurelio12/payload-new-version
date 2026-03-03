import type { CollectionConfig } from 'payload'
import { afterContentChange } from '../hooks/revalidateCloudflare'

// This collection behaves as a "global" per tenant using the multi-tenant plugin's isGlobal option
export const SiteConfig: CollectionConfig = {
  slug: 'site-config',
  admin: {
    useAsTitle: 'siteName',
    group: 'Settings',
  },
  access: {
    // Site config is public for reading (needed for frontend)
    read: () => true,
  },
  hooks: {
    // Site config changes should always trigger rebuild (no status field)
    afterChange: [afterContentChange],
  },
  fields: [
    {
      name: 'siteName',
      type: 'text',
      required: true,
      admin: {
        description: 'The name of the website',
      },
    },
    {
      name: 'siteDescription',
      type: 'textarea',
      admin: {
        description: 'Brief description of the website',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site logo',
      },
    },
    {
      name: 'favicon',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Site favicon',
      },
    },
    {
      name: 'social',
      type: 'group',
      fields: [
        {
          name: 'twitter',
          type: 'text',
          admin: {
            description: 'Twitter/X handle (e.g., @username)',
          },
        },
        {
          name: 'facebook',
          type: 'text',
          admin: {
            description: 'Facebook URL',
          },
        },
        {
          name: 'instagram',
          type: 'text',
          admin: {
            description: 'Instagram URL',
          },
        },
        {
          name: 'linkedin',
          type: 'text',
          admin: {
            description: 'LinkedIn URL',
          },
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      fields: [
        {
          name: 'email',
          type: 'email',
        },
        {
          name: 'phone',
          type: 'text',
        },
        {
          name: 'whatsapp',
          type: 'text',
          admin: {
            description: 'Número WhatsApp (ex: +351 912 345 678)',
          },
        },
        {
          name: 'address',
          type: 'textarea',
        },
      ],
    },
    {
      name: 'seo',
      type: 'group',
      fields: [
        {
          name: 'metaTitle',
          type: 'text',
          admin: {
            description: 'Default meta title for the site',
          },
        },
        {
          name: 'metaDescription',
          type: 'textarea',
          admin: {
            description: 'Default meta description for the site',
          },
        },
        {
          name: 'ogImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Default Open Graph image',
          },
        },
      ],
    },
    {
      name: 'header',
      type: 'group',
      fields: [
        {
          name: 'navigation',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
            {
              name: 'openInNewTab',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },
    {
      name: 'footer',
      type: 'group',
      fields: [
        {
          name: 'copyright',
          type: 'text',
        },
        {
          name: 'navigation',
          type: 'array',
          fields: [
            {
              name: 'label',
              type: 'text',
              required: true,
            },
            {
              name: 'url',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },
    {
      name: 'analytics',
      type: 'group',
      fields: [
        {
          name: 'googleAnalyticsId',
          type: 'text',
          admin: {
            description: 'Google Analytics tracking ID (e.g., G-XXXXXXXXXX)',
          },
        },
        {
          name: 'googleTagManagerId',
          type: 'text',
          admin: {
            description: 'Google Tag Manager ID (e.g., GTM-XXXXXXX)',
          },
        },
      ],
    },
    {
      name: 'welcome',
      type: 'group',
      admin: {
        description: 'Welcome page customization',
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          admin: {
            description: 'Custom headline for the welcome page',
          },
        },
        {
          name: 'subheadline',
          type: 'textarea',
          admin: {
            description: 'Custom subheadline for the welcome page',
          },
        },
        {
          name: 'showOnboardingSteps',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Show onboarding steps for first-time users',
          },
        },
      ],
    },
  ],
}
