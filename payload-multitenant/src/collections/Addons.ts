import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const Addons: CollectionConfig = {
  slug: 'addons',
  admin: {
    useAsTitle: 'name',
    group: 'Proposal Components',
    description: 'Serviços adicionais disponíveis para propostas',
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
        description: 'Nome do addon (ex: "Agente SEO Blog")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador URL-safe',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/^-|-$/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Descrição breve do addon',
      },
    },
    {
      name: 'setupPrice',
      type: 'number',
      required: true,
      admin: {
        description: 'Preço de setup (sem IVA)',
      },
    },
    {
      name: 'monthlyPrice',
      type: 'number',
      required: true,
      admin: {
        description: 'Preço mensal (sem IVA)',
      },
    },
    {
      name: 'hoursSaved',
      type: 'number',
      admin: {
        description: 'Horas poupadas por mês (para ROI)',
      },
    },
    {
      name: 'retentionBoost',
      type: 'number',
      admin: {
        description: 'Aumento de retenção % (para ROI)',
      },
    },
    {
      name: 'detailedSolution',
      type: 'richText',
      admin: {
        description: 'Descrição detalhada da solução',
      },
    },
    {
      name: 'roiImpact',
      type: 'richText',
      admin: {
        description: 'Impacto no ROI',
      },
    },
    {
      name: 'thirdPartyCosts',
      type: 'richText',
      admin: {
        description: 'Custos de terceiros envolvidos',
      },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'automation',
      options: [
        { label: 'Automation', value: 'automation' },
        { label: 'SEO', value: 'seo' },
        { label: 'Content', value: 'content' },
        { label: 'Integration', value: 'integration' },
        { label: 'Support', value: 'support' },
        { label: 'Other', value: 'other' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'popular',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Destacar como popular',
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
