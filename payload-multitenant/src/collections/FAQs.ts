import type { CollectionConfig } from 'payload'
import { isSuperAdminOrAlinhadamente } from '../access'

export const FAQs: CollectionConfig = {
  slug: 'faqs',
  admin: {
    useAsTitle: 'question',
    group: 'Proposal Components',
    description: 'Perguntas frequentes para incluir nas propostas',
  },
  access: {
    create: isSuperAdminOrAlinhadamente,
    read: isSuperAdminOrAlinhadamente,
    update: isSuperAdminOrAlinhadamente,
    delete: isSuperAdminOrAlinhadamente,
  },
  fields: [
    {
      name: 'question',
      type: 'text',
      required: true,
      admin: {
        description: 'Pergunta',
      },
    },
    {
      name: 'answer',
      type: 'richText',
      required: true,
      admin: {
        description: 'Resposta',
      },
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      defaultValue: 'general',
      options: [
        { label: 'Direitos', value: 'direitos' },
        { label: 'Deveres', value: 'deveres' },
        { label: 'Suporte', value: 'suporte' },
        { label: 'Técnico', value: 'tecnico' },
        { label: 'Financeiro', value: 'financeiro' },
        { label: 'Geral', value: 'general' },
      ],
      admin: {
        description: 'Categoria para organização',
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
