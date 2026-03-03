import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const Motores: CollectionConfig = {
  slug: 'motores',
  admin: {
    useAsTitle: 'title',
    group: 'Proposal Components',
    description: 'Motores disponíveis para incluir nas propostas',
  },
  access: {
    create: isSuperAdminOrAlinhadamente,
    read: isSuperAdminOrAlinhadamente,
    update: isSuperAdminOrAlinhadamente,
    delete: isSuperAdminOrAlinhadamente,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome do motor (ex: "Motor de Artigos")',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'Identificador URL-safe (ex: "motor-artigos")',
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.title) {
              return data.title
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
        description: 'Descrição breve do motor',
      },
    },
    {
      name: 'icon',
      type: 'select',
      required: true,
      defaultValue: 'Document',
      options: [
        { label: 'Document', value: 'Document' },
        { label: 'Microphone', value: 'Microphone' },
        { label: 'User Group', value: 'UserGroup' },
        { label: 'Scale', value: 'Scale' },
        { label: 'Briefcase', value: 'Briefcase' },
        { label: 'Chart', value: 'Chart' },
        { label: 'Cog', value: 'Cog' },
        { label: 'Globe', value: 'Globe' },
      ],
      admin: {
        description: 'Ícone a exibir no frontend',
      },
    },
    {
      name: 'features',
      type: 'array',
      required: true,
      admin: {
        description: 'Lista de features do motor',
      },
      fields: [
        {
          name: 'featureText',
          type: 'text',
          required: true,
          admin: {
            description: 'Texto da feature',
          },
        },
      ],
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Motor disponível para uso',
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
