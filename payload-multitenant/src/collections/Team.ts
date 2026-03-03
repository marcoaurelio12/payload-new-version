import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const Team: CollectionConfig = {
  slug: 'team',
  admin: {
    useAsTitle: 'name',
    group: 'Proposal Components',
    description: 'Membros da equipa para incluir nas propostas',
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
        description: 'Nome completo (ex: "Carlos Alinhado")',
      },
    },
    {
      name: 'role',
      type: 'text',
      required: true,
      admin: {
        description: 'Cargo (ex: "CTO & Fundador")',
      },
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
      admin: {
        description: 'Biografia breve',
      },
    },
    {
      name: 'photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description: 'Foto de perfil',
      },
    },
    {
      name: 'email',
      type: 'email',
      admin: {
        description: 'Email de contacto (opcional)',
      },
    },
    {
      name: 'linkedin',
      type: 'text',
      admin: {
        description: 'URL do LinkedIn (opcional)',
      },
    },
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: true,
      admin: {
        position: 'sidebar',
        description: 'Membro ativo na equipa',
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
