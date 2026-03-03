import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const ProposalTemplates: CollectionConfig = {
  slug: 'proposal-templates',
  admin: {
    useAsTitle: 'name',
    group: 'Proposals',
    description: 'Templates reutilizáveis para criar propostas rapidamente',
  },
  access: {
    create: isSuperAdminOrAlinhadamente,
    read: isSuperAdminOrAlinhadamente,
    update: isSuperAdminOrAlinhadamente,
    delete: isSuperAdminOrAlinhadamente,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome do template',
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Descrição do template',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'itServices',
      options: [
        { label: 'Web Design', value: 'webDesign' },
        { label: 'IT Services', value: 'itServices' },
        { label: 'Consulting', value: 'consulting' },
        { label: 'Custom', value: 'custom' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'niche',
      type: 'select',
      defaultValue: 'geral',
      options: [
        { label: 'Advocacia', value: 'advocacia' },
        { label: 'Retalho', value: 'retalho' },
        { label: 'Tecnologia', value: 'tecnologia' },
        { label: 'Saúde', value: 'saude' },
        { label: 'Geral', value: 'geral' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Nicho de mercado alvo',
      },
    },

    // Default Hero
    {
      name: 'defaultHero',
      type: 'group',
      admin: {
        description: 'Hero section padrão',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          admin: {
            description: 'Título padrão (pode usar {{companyName}})',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
      ],
    },

    // Default Diagnostic
    {
      name: 'defaultDiagnostic',
      type: 'group',
      admin: {
        description: 'Diagnóstico padrão',
      },
      fields: [
        {
          name: 'problem',
          type: 'textarea',
        },
        {
          name: 'solution',
          type: 'textarea',
        },
      ],
    },

    // Default Components
    {
      name: 'defaultMotores',
      type: 'relationship',
      relationTo: 'motores',
      hasMany: true,
      admin: {
        description: 'Motores incluídos por defeito',
      },
    },
    {
      name: 'defaultAddons',
      type: 'relationship',
      relationTo: 'addons',
      hasMany: true,
      admin: {
        description: 'Addons disponíveis por defeito',
      },
    },
    {
      name: 'defaultTestimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        description: 'Depoimentos padrão',
      },
    },
    {
      name: 'defaultTeam',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      admin: {
        description: 'Equipa padrão',
      },
    },
    {
      name: 'defaultFaqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        description: 'FAQs padrão',
      },
    },

    // Default Pricing
    {
      name: 'defaultPricing',
      type: 'group',
      admin: {
        description: 'Preços padrão',
      },
      fields: [
        {
          name: 'setupPrice',
          type: 'number',
          admin: {
            description: 'Preço de setup padrão',
          },
        },
        {
          name: 'monthlyBase',
          type: 'number',
          admin: {
            description: 'Preço mensal padrão',
          },
        },
        {
          name: 'setupLabel',
          type: 'text',
          defaultValue: 'Alinhado',
        },
        {
          name: 'tiers',
          type: 'array',
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
            },
            {
              name: 'setupPrice',
              type: 'number',
              required: true,
            },
            {
              name: 'monthlyPrice',
              type: 'number',
              required: true,
            },
            {
              name: 'features',
              type: 'array',
              fields: [
                {
                  name: 'feature',
                  type: 'text',
                  required: true,
                },
              ],
            },
            {
              name: 'recommended',
              type: 'checkbox',
              defaultValue: false,
            },
          ],
        },
      ],
    },

    // Default Roadmap
    {
      name: 'defaultRoadmap',
      type: 'array',
      admin: {
        description: 'Fases padrão do roadmap',
      },
      fields: [
        {
          name: 'phase',
          type: 'number',
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'duration',
          type: 'text',
          required: true,
        },
        {
          name: 'agencyTasks',
          type: 'array',
          fields: [
            {
              name: 'task',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'clientTasks',
          type: 'array',
          fields: [
            {
              name: 'task',
              type: 'text',
              required: true,
            },
          ],
        },
      ],
    },

    // Metadata
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'order',
      type: 'number',
      admin: {
        position: 'sidebar',
        description: 'Ordem de exibição',
      },
    },
  ],
  defaultSort: 'order',
}
