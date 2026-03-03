import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  admin: {
    useAsTitle: 'clientName',
    group: 'Proposal Components',
    description: 'Depoimentos de clientes para incluir nas propostas',
  },
  access: {
    create: isSuperAdminOrAlinhadamente,
    read: isSuperAdminOrAlinhadamente,
    update: isSuperAdminOrAlinhadamente,
    delete: isSuperAdminOrAlinhadamente,
  },
  fields: [
    {
      name: 'clientName',
      type: 'text',
      required: true,
      admin: {
        description: 'Nome do cliente (ex: "Dr. João Mendes")',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Cargo (ex: "Sócio Gerente")',
      },
    },
    {
      name: 'company',
      type: 'text',
      required: true,
      admin: {
        description: 'Empresa (ex: "Mendes & Associados")',
      },
    },
    {
      name: 'quote',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Depoimento',
      },
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Logo da empresa (opcional)',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Foto do cliente (opcional)',
      },
    },
    {
      name: 'niche',
      type: 'select',
      options: [
        { label: 'Advocacia', value: 'advocacia' },
        { label: 'Retalho', value: 'retalho' },
        { label: 'Tecnologia', value: 'tecnologia' },
        { label: 'Saúde', value: 'saude' },
        { label: 'Geral', value: 'geral' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Nicho de mercado para filtragem',
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
      name: 'featured',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        position: 'sidebar',
        description: 'Destacar como depoimento principal',
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
