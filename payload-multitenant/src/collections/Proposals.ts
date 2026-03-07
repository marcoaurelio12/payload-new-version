import type { CollectionConfig } from 'payload'
import { canManageProposals, canViewProposals } from '../access'

export const Proposals: CollectionConfig = {
  slug: 'proposals',
  admin: {
    useAsTitle: 'title',
    group: 'Proposals',
    description: 'Propostas interativas enviadas a clientes',
    defaultColumns: ['title', 'client.name', 'status', 'createdAt'],
  },
  access: {
    create: canManageProposals,
    read: canViewProposals,
    update: canManageProposals,
    delete: canManageProposals,
  },
  fields: [
    // Basic Info
    {
      name: 'title',
      type: 'text',
      required: true,
      admin: {
        description: 'Título interno da proposta',
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: 'URL única para aceder à proposta',
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
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'draft',
      options: [
        { label: 'Rascunho', value: 'draft' },
        { label: 'Enviada', value: 'sent' },
        { label: 'Visualizada', value: 'viewed' },
        { label: 'Aceite', value: 'accepted' },
        { label: 'Rejeitada', value: 'rejected' },
        { label: 'Expirada', value: 'expired' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'versionType',
      type: 'select',
      defaultValue: 'complete',
      options: [
        { label: 'Express', value: 'express' },
        { label: 'Completa', value: 'complete' },
        { label: 'Ambas', value: 'both' },
      ],
      admin: {
        position: 'sidebar',
        description: 'Versão da proposta a apresentar',
      },
    },

    // Client Info
    {
      name: 'client',
      type: 'group',
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          admin: {
            description: 'Nome do cliente',
          },
        },
        {
          name: 'email',
          type: 'email',
          required: true,
          admin: {
            description: 'Email do cliente',
          },
        },
        {
          name: 'company',
          type: 'text',
          admin: {
            description: 'Empresa (opcional)',
          },
        },
        {
          name: 'phone',
          type: 'text',
          admin: {
            description: 'Telefone (opcional)',
          },
        },
      ],
    },

    // Hero Section
    {
      name: 'hero',
      type: 'group',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Título principal da proposta (ex: "A Nova Era Digital da VdA")',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            description: 'Subtítulo/descrição do hero',
          },
        },
        {
          name: 'loomUrl',
          type: 'text',
          admin: {
            description: 'URL do vídeo Loom (opcional)',
          },
        },
        {
          name: 'thumbnailImage',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Imagem de fundo do vídeo (thumbnail)',
          },
        },
      ],
    },

    // Diagnostic
    {
      name: 'diagnostic',
      type: 'group',
      admin: {
        description: 'Diagnóstico: problema e solução',
      },
      fields: [
        {
          name: 'problemLabel',
          type: 'text',
          defaultValue: 'Desafios & Riscos',
          admin: {
            description: 'Label para a secção de problema',
          },
        },
        {
          name: 'problem',
          type: 'textarea',
          admin: {
            description: 'Descrição do problema atual',
          },
        },
        {
          name: 'solutionLabel',
          type: 'text',
          defaultValue: 'Soberania & Performance',
          admin: {
            description: 'Label para a secção de solução',
          },
        },
        {
          name: 'solution',
          type: 'textarea',
          admin: {
            description: 'Solução proposta',
          },
        },
      ],
    },

    // Motores & Addons
    {
      name: 'motoresIncluidos',
      type: 'relationship',
      relationTo: 'motores',
      hasMany: true,
      admin: {
        description: 'Motores incluídos nesta proposta',
      },
    },
    {
      name: 'addonsDisponiveis',
      type: 'relationship',
      relationTo: 'addons',
      hasMany: true,
      admin: {
        description: 'Addons disponíveis para o cliente escolher',
      },
    },

    // Pricing
    {
      name: 'pricing',
      type: 'group',
      admin: {
        description: 'Configuração de preços',
      },
      fields: [
        {
          name: 'setupPrice',
          type: 'number',
          required: true,
          admin: {
            description: 'Preço de setup base (sem IVA)',
          },
        },
        {
          name: 'monthlyBase',
          type: 'number',
          required: true,
          admin: {
            description: 'Preço mensal base (sem IVA)',
          },
        },
        {
          name: 'setupLabel',
          type: 'text',
          defaultValue: 'Alinhado',
          admin: {
            description: 'Label para o plano base',
          },
        },
        {
          name: 'tiers',
          type: 'array',
          admin: {
            description: 'Planos de preços alternativos',
          },
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
                {
                  name: 'tooltip',
                  type: 'text',
                  admin: {
                    description: 'Texto explicativo opcional que aparece ao passar o rato por cima da feature',
                  },
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
        {
          name: 'notes',
          type: 'richText',
          admin: {
            description: 'Notas sobre preços',
          },
        },
      ],
    },

    // Roadmap
    {
      name: 'roadmapPhases',
      type: 'array',
      admin: {
        description: 'Fases do plano de ação',
      },
      fields: [
        {
          name: 'phase',
          type: 'number',
          required: true,
          admin: {
            description: 'Número da fase',
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          admin: {
            description: 'Título da fase (ex: "Setup Inicial")',
          },
        },
        {
          name: 'duration',
          type: 'text',
          required: true,
          admin: {
            description: 'Duração (ex: "Semana 1-2")',
          },
        },
        {
          name: 'agencyTasks',
          type: 'array',
          admin: {
            description: 'Tarefas da agência',
          },
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
          admin: {
            description: 'Tarefas do cliente',
          },
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

    // Social Proof
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: {
        description: 'Depoimentos a incluir',
      },
    },
    {
      name: 'team',
      type: 'relationship',
      relationTo: 'team',
      hasMany: true,
      admin: {
        description: 'Membros da equipa a apresentar',
      },
    },
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: {
        description: 'FAQs a incluir',
      },
    },

    // Included Items (Express Version)
    {
      name: 'includedItems',
      type: 'array',
      admin: {
        description: 'Items incluídos na proposta (versão Express)',
      },
      fields: [
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
        },
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'subtitle',
          type: 'text',
        },
        {
          name: 'features',
          type: 'array',
          fields: [
            {
              name: 'featureText',
              type: 'text',
              required: true,
            },
          ],
        },
        {
          name: 'order',
          type: 'number',
          admin: {
            description: 'Ordem de exibição',
          },
        },
      ],
    },

    // Variable Costs
    {
      name: 'variableCosts',
      type: 'array',
      admin: {
        description: 'Custos variáveis externos',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
        },
        {
          name: 'estimatedCost',
          type: 'number',
          required: true,
          admin: {
            description: 'Custo estimado em EUR',
          },
        },
        {
          name: 'description',
          type: 'textarea',
        },
        {
          name: 'required',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Se é obrigatório ou opcional',
          },
        },
      ],
    },

    // Template Reference
    {
      name: 'template',
      type: 'relationship',
      relationTo: 'proposal-templates',
      admin: {
        position: 'sidebar',
        description: 'Template usado como base (opcional)',
      },
    },

    // Validity
    {
      name: 'validUntil',
      type: 'date',
      admin: {
        position: 'sidebar',
        description: 'Data de validade da proposta',
      },
    },

    // Tracking (auto-populated)
    {
      name: 'sentAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Data de envio (auto)',
      },
    },
    {
      name: 'viewedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Primeira visualização (auto)',
      },
    },
    {
      name: 'respondedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Data de resposta (auto)',
      },
    },
    {
      name: 'rejectionReason',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Motivo da rejeição (se aplicável)',
      },
    },
    {
      name: 'publicToken',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        description: 'Token para acesso público (usado internamente)',
      },
      hooks: {
        beforeChange: [
          ({ value, operation }) => {
            // Generate token on create if not provided
            if (operation === 'create' && !value) {
              return crypto.randomUUID()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'accessPass',
      type: 'text',
      required: true,
      admin: {
        position: 'sidebar',
        description: 'Código de acesso que o cliente deve inserir para ver a proposta (ex: "verao2025")',
      },
      hooks: {
        beforeChange: [
          ({ value, operation, data }) => {
            // Generate a random pass on create if not provided
            if (operation === 'create' && !value) {
              // Generate a readable 6-character code (letters and numbers)
              const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789' // Removed confusing chars: I, O, 0, 1
              let pass = ''
              for (let i = 0; i < 6; i++) {
                pass += chars.charAt(Math.floor(Math.random() * chars.length))
              }
              return pass
            }
            return value
          },
        ],
      },
    },
  ],
  hooks: {
    afterChange: [
      async ({ doc, operation, previousDoc, req }) => {
        // Track status changes
        if (operation === 'update' && previousDoc) {
          // Mark as viewed when first accessed
          if (previousDoc.status === 'sent' && doc.status === 'viewed' && !doc.viewedAt) {
            await req.payload.update({
              collection: 'proposals',
              id: doc.id,
              data: {
                viewedAt: new Date().toISOString(),
              },
              req,
            })
          }

          // Mark as responded when accepted or rejected
          if (
            ['accepted', 'rejected'].includes(doc.status) &&
            !previousDoc.status.includes(['accepted', 'rejected']) &&
            !doc.respondedAt
          ) {
            await req.payload.update({
              collection: 'proposals',
              id: doc.id,
              data: {
                respondedAt: new Date().toISOString(),
              },
              req,
            })
          }
        }

        // Set sentAt when status changes to sent
        if (operation === 'update' && doc.status === 'sent' && !doc.sentAt) {
          await req.payload.update({
            collection: 'proposals',
            id: doc.id,
            data: {
              sentAt: new Date().toISOString(),
            },
            req,
          })
        }

        return doc
      },
    ],
  },
  timestamps: true,
  endpoints: [
    /**
     * Get minimal public proposal data (for frontend to display login screen)
     * GET /api/proposals/public/:slug
     * Returns ONLY: { title, clientName, status }
     * Full data requires POST /public/:slug/verify with accessPass
     */
    {
      path: '/public/:slug',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400 })
        }

        try {
          const proposal = await req.payload.find({
            collection: 'proposals',
            where: {
              slug: { equals: slug },
            },
            depth: 0, // No need to populate relationships
            limit: 1,
            overrideAccess: true,
          })

          if (proposal.docs.length === 0) {
            return Response.json({ error: 'Proposta não encontrada' }, { status: 404 })
          }

          const doc = proposal.docs[0]

          // Check if proposal is accessible
          if (doc.status === 'draft') {
            return Response.json({ error: 'Esta proposta ainda não foi enviada' }, { status: 403 })
          }

          if (doc.status === 'expired') {
            return Response.json({ error: 'Esta proposta expirou' }, { status: 403 })
          }

          // Return ONLY minimal data - no pricing, diagnostic, motores, addons, etc.
          // Full data requires accessPass verification via POST /public/:slug/verify
          return Response.json({
            title: doc.hero?.title || doc.title,
            clientName: doc.client?.name,
            status: doc.status,
          })
        } catch (error) {
          console.error('Error fetching public proposal:', error)
          return Response.json({ error: 'Erro ao carregar proposta' }, { status: 500 })
        }
      },
    },

    /**
     * Verify access code and return proposal data
     * POST /api/proposals/public/:slug/verify
     * Body: { accessPass: string }
     * Returns: proposal data if correct, 401 if wrong
     */
    {
      path: '/public/:slug/verify',
      method: 'post',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400 })
        }

        // Get accessPass from request body
        let body
        try {
          body = await req.json?.()
        } catch {
          return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const { accessPass } = body || {}

        if (!accessPass) {
          return Response.json({ error: 'Código de acesso é obrigatório' }, { status: 400 })
        }

        try {
          const proposal = await req.payload.find({
            collection: 'proposals',
            where: {
              slug: { equals: slug },
            },
            depth: 2,
            limit: 1,
            overrideAccess: true,
          })

          if (proposal.docs.length === 0) {
            return Response.json({ error: 'Proposta não encontrada' }, { status: 404 })
          }

          const doc = proposal.docs[0]

          // Verify access pass (case-insensitive)
          if (!doc.accessPass || doc.accessPass.toUpperCase() !== accessPass.toUpperCase()) {
            return Response.json({ error: 'Código de acesso incorreto' }, { status: 401 })
          }

          // Check if proposal is accessible (not expired, draft, or already responded)
          if (doc.status === 'draft') {
            return Response.json({ error: 'Esta proposta ainda não foi enviada' }, { status: 403 })
          }

          if (doc.status === 'expired') {
            return Response.json({ error: 'Esta proposta expirou' }, { status: 403 })
          }

          // Update status to 'viewed' on first access if currently 'sent'
          if (doc.status === 'sent') {
            await req.payload.update({
              collection: 'proposals',
              id: doc.id,
              data: { status: 'viewed', viewedAt: new Date().toISOString() },
              overrideAccess: true,
            })
          }

          // Return proposal without sensitive fields
          const { accessPass: _, publicToken: __, ...safeDoc } = doc

          return Response.json(safeDoc)
        } catch (error) {
          console.error('Error verifying proposal access:', error)
          return Response.json({ error: 'Erro ao verificar proposta' }, { status: 500 })
        }
      },
    },

    /**
     * Accept a proposal
     * POST /api/proposals/public/:slug/accept
     * Body: { accessPass: string }
     */
    {
      path: '/public/:slug/accept',
      method: 'post',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400 })
        }

        let body
        try {
          body = await req.json?.()
        } catch {
          return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const { accessPass } = body || {}

        if (!accessPass) {
          return Response.json({ error: 'Código de acesso é obrigatório' }, { status: 400 })
        }

        try {
          const proposal = await req.payload.find({
            collection: 'proposals',
            where: { slug: { equals: slug } },
            depth: 0,
            limit: 1,
            overrideAccess: true,
          })

          if (proposal.docs.length === 0) {
            return Response.json({ error: 'Proposta não encontrada' }, { status: 404 })
          }

          const doc = proposal.docs[0]

          // Verify access pass
          if (!doc.accessPass || doc.accessPass.toUpperCase() !== accessPass.toUpperCase()) {
            return Response.json({ error: 'Código de acesso incorreto' }, { status: 401 })
          }

          // Check if proposal can be accepted
          if (!['sent', 'viewed'].includes(doc.status)) {
            return Response.json(
              { error: 'Esta proposta não pode ser aceite no estado atual' },
              { status: 400 }
            )
          }

          const updated = await req.payload.update({
            collection: 'proposals',
            id: doc.id,
            data: {
              status: 'accepted',
              respondedAt: new Date().toISOString(),
            },
            overrideAccess: true,
          })

          return Response.json({ success: true, proposal: updated })
        } catch (error) {
          console.error('Error accepting proposal:', error)
          return Response.json({ error: 'Erro ao aceitar proposta' }, { status: 500 })
        }
      },
    },

    /**
     * Reject a proposal
     * POST /api/proposals/public/:slug/reject
     * Body: { accessPass: string, reason?: string }
     */
    {
      path: '/public/:slug/reject',
      method: 'post',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400 })
        }

        let body
        try {
          body = await req.json?.()
        } catch {
          return Response.json({ error: 'Invalid request body' }, { status: 400 })
        }

        const { accessPass, reason } = body || {}

        if (!accessPass) {
          return Response.json({ error: 'Código de acesso é obrigatório' }, { status: 400 })
        }

        try {
          const proposal = await req.payload.find({
            collection: 'proposals',
            where: { slug: { equals: slug } },
            depth: 0,
            limit: 1,
            overrideAccess: true,
          })

          if (proposal.docs.length === 0) {
            return Response.json({ error: 'Proposta não encontrada' }, { status: 404 })
          }

          const doc = proposal.docs[0]

          // Verify access pass
          if (!doc.accessPass || doc.accessPass.toUpperCase() !== accessPass.toUpperCase()) {
            return Response.json({ error: 'Código de acesso incorreto' }, { status: 401 })
          }

          // Check if proposal can be rejected
          if (!['sent', 'viewed'].includes(doc.status)) {
            return Response.json(
              { error: 'Esta proposta não pode ser rejeitada no estado atual' },
              { status: 400 }
            )
          }

          const updated = await req.payload.update({
            collection: 'proposals',
            id: doc.id,
            data: {
              status: 'rejected',
              respondedAt: new Date().toISOString(),
              rejectionReason: reason || undefined,
            },
            overrideAccess: true,
          })

          return Response.json({ success: true, proposal: updated })
        } catch (error) {
          console.error('Error rejecting proposal:', error)
          return Response.json({ error: 'Erro ao rejeitar proposta' }, { status: 500 })
        }
      },
    },

    /**
     * Check if a proposal exists (for frontend to show login screen)
     * GET /api/proposals/public/:slug/exists
     * Returns ONLY: { exists: boolean, title, clientName, status }
     * No business data exposed - full data requires accessPass verification
     */
    {
      path: '/public/:slug/exists',
      method: 'get',
      handler: async (req) => {
        const slug = req.routeParams?.slug as string | undefined

        if (!slug) {
          return Response.json({ error: 'Slug is required' }, { status: 400 })
        }

        try {
          const proposal = await req.payload.find({
            collection: 'proposals',
            where: { slug: { equals: slug } },
            depth: 0,
            limit: 1,
            overrideAccess: true,
          })

          if (proposal.docs.length === 0) {
            return Response.json({ exists: false }, { status: 404 })
          }

          const doc = proposal.docs[0]

          // Return ONLY minimal info - no validUntil, no business data
          // Full data requires POST /public/:slug/verify with accessPass
          return Response.json({
            exists: true,
            title: doc.hero?.title || doc.title,
            clientName: doc.client?.name,
            status: doc.status,
          })
        } catch (error) {
          console.error('Error checking proposal:', error)
          return Response.json({ error: 'Erro ao verificar proposta' }, { status: 500 })
        }
      },
    },
  ],
}
