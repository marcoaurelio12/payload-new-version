/**
 * Seed script for initial data
 * Run with: pnpm payload run src/scripts/seed.ts
 */

import { getPayload } from 'payload'
import config from '../payload.config'

async function seed() {
  console.log('🌱 Starting seed...')

  const payload = await getPayload({ config })

  // ============================================
  // 1. Create Alinhadamente Tenant
  // ============================================
  console.log('📋 Creating Alinhadamente tenant...')

  const alinhadamenteTenant = await payload.create({
    collection: 'tenants',
    data: {
      name: 'Alinhadamente',
      slug: 'alinhadamente',
      domain: 'alinhadamente.pt',
      active: true,
    },
    overrideAccess: true,
  })

  console.log(`✅ Created tenant: ${alinhadamenteTenant.name}`)

  // ============================================
  // 2. Create Super Admin User
  // ============================================
  console.log('👤 Creating super admin user...')

  const superAdmin = await payload.create({
    collection: 'users',
    data: {
      email: 'admin@alinhadamente.pt',
      password: 'ChangeMe123!',
      firstName: 'Admin',
      lastName: 'Alinhadamente',
      role: 'superAdmin',
    },
    overrideAccess: true,
  })

  console.log(`✅ Created super admin: ${superAdmin.email}`)

  // ============================================
  // 3. Create Team Members
  // ============================================
  console.log('👥 Creating team members...')

  const teamMembers = await Promise.all([
    payload.create({
      collection: 'team',
      data: {
        name: 'Carlos Alinhado',
        role: 'CTO & Fundador',
        bio: 'Especialista em sistemas distribuídos e automação de processos. 15+ anos de experiência em IT.',
        email: 'carlos@alinhadamente.pt',
        linkedin: 'https://linkedin.com/in/carlos-alinhado',
        active: true,
        order: 1,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'team',
      data: {
        name: 'Ana Silva',
        role: 'Lead Developer',
        bio: 'Full-stack developer com foco em Next.js e Payload CMS. Apaixonada por código limpo.',
        email: 'ana@alinhadamente.pt',
        active: true,
        order: 2,
      },
      overrideAccess: true,
    }),
  ])

  console.log(`✅ Created ${teamMembers.length} team members`)

  // ============================================
  // 4. Create Motores
  // ============================================
  console.log('⚙️ Creating motores...')

  const motores = await Promise.all([
    payload.create({
      collection: 'motores',
      data: {
        title: 'Motor de Artigos',
        slug: 'motor-artigos',
        description: 'Gestão de autoridade jurídica com SEO otimizado para escritórios de advocacia.',
        icon: 'Document',
        features: [
          { featureText: 'Gestão via Payload CMS dedicado.' },
          { featureText: 'Integração com redes sociais automáticas.' },
          { featureText: 'Indexação automática no Google.' },
          { featureText: 'Templates de artigos jurídicos.' },
        ],
        active: true,
        order: 1,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'motores',
      data: {
        title: 'Motor de Podcast',
        slug: 'motor-podcast',
        description: 'Produção e distribuição de conteúdo áudio para posicionamento de autoridade.',
        icon: 'Microphone',
        features: [
          { featureText: 'Gravação e edição profissional.' },
          { featureText: 'Distribuição em todas as plataformas.' },
          { featureText: 'Transcrição automática para SEO.' },
          { featureText: 'Clips para redes sociais.' },
        ],
        active: true,
        order: 2,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'motores',
      data: {
        title: 'Motor de CRM',
        slug: 'motor-crm',
        description: 'Gestão de relacionamento com clientes e automação de vendas.',
        icon: 'UserGroup',
        features: [
          { featureText: 'Pipeline de vendas visual.' },
          { featureText: 'Automação de follow-ups.' },
          { featureText: 'Integração com email.' },
          { featureText: 'Relatórios de conversão.' },
        ],
        active: true,
        order: 3,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'motores',
      data: {
        title: 'Motor de Compliance',
        slug: 'motor-compliance',
        description: 'Gestão de conformidade regulatória e documentação legal.',
        icon: 'Scale',
        features: [
          { featureText: 'Templates de documentos legais.' },
          { featureText: 'Alertas de prazos automáticos.' },
          { featureText: 'Gestão de versões.' },
          { featureText: 'Auditoria completa.' },
        ],
        active: true,
        order: 4,
      },
      overrideAccess: true,
    }),
  ])

  console.log(`✅ Created ${motores.length} motores`)

  // ============================================
  // 5. Create Addons
  // ============================================
  console.log('📦 Creating addons...')

  const addons = await Promise.all([
    payload.create({
      collection: 'addons',
      data: {
        name: 'Agente SEO Blog',
        slug: 'agente-seo-blog',
        description: 'Otimização automática de conteúdo para nicho jurídico PT.',
        setupPrice: 500,
        monthlyPrice: 150,
        hoursSaved: 8,
        retentionBoost: 10,
        category: 'seo',
        popular: true,
        active: true,
        order: 1,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'addons',
      data: {
        name: 'Chatbot Jurídico',
        slug: 'chatbot-juridico',
        description: 'Assistente virtual 24/7 para atendimento inicial de clientes.',
        setupPrice: 800,
        monthlyPrice: 200,
        hoursSaved: 15,
        retentionBoost: 20,
        category: 'automation',
        popular: true,
        active: true,
        order: 2,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'addons',
      data: {
        name: 'Integração SIGA',
        slug: 'integracao-siga',
        description: 'Sincronização automática com o sistema SIGA da Ordem dos Advogados.',
        setupPrice: 300,
        monthlyPrice: 50,
        hoursSaved: 3,
        retentionBoost: 5,
        category: 'integration',
        active: true,
        order: 3,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'addons',
      data: {
        name: 'Suporte Prioritário',
        slug: 'suporte-prioritario',
        description: 'Suporte técnico prioritário com resposta em até 2 horas.',
        setupPrice: 0,
        monthlyPrice: 100,
        category: 'support',
        active: true,
        order: 4,
      },
      overrideAccess: true,
    }),
  ])

  console.log(`✅ Created ${addons.length} addons`)

  // ============================================
  // 6. Create Testimonials
  // ============================================
  console.log('💬 Creating testimonials...')

  const testimonials = await Promise.all([
    payload.create({
      collection: 'testimonials',
      data: {
        clientName: 'Dr. João Mendes',
        role: 'Sócio Gerente',
        company: 'Mendes & Associados',
        quote: 'A Alinhadamente transformou a nossa presença digital. Em 6 meses, triplicámos as consultas orgânicas.',
        niche: 'advocacia',
        featured: true,
        active: true,
        order: 1,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        clientName: 'Dra. Maria Santos',
        role: 'Managing Partner',
        company: 'Santos & Costa Advogados',
        quote: 'O Motor de Artigos posicionou-nos como referência no nosso nicho. Resultados impressionantes.',
        niche: 'advocacia',
        active: true,
        order: 2,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'testimonials',
      data: {
        clientName: 'Dr. Pedro Oliveira',
        role: 'Fundador',
        company: 'Oliveira Legal Studio',
        quote: 'Finalmente temos um parceiro de IT que entende as necessidades de um escritório de advocacia.',
        niche: 'advocacia',
        active: true,
        order: 3,
      },
      overrideAccess: true,
    }),
  ])

  console.log(`✅ Created ${testimonials.length} testimonials`)

  // ============================================
  // 7. Create FAQs
  // ============================================
  console.log('❓ Creating FAQs...')

  const faqs = await Promise.all([
    payload.create({
      collection: 'faqs',
      data: {
        question: 'Quanto tempo demora a implementação inicial?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'A implementação base demora entre 2 a 4 semanas, dependendo da complexidade e número de motores selecionados.',
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'root',
          },
        },
        category: 'general',
        niche: 'advocacia',
        active: true,
        order: 1,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'faqs',
      data: {
        question: 'Posso cancelar a qualquer momento?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'Sim, não existe fidelização mínima. Pode cancelar com 30 dias de aviso prévio. Os seus dados serão exportados em formato standard.',
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'root',
          },
        },
        category: 'direitos',
        niche: 'advocacia',
        active: true,
        order: 2,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'faqs',
      data: {
        question: 'O suporte está incluído?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'Sim, todos os planos incluem suporte por email com resposta em 24h. Suporte prioritário está disponível como addon.',
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'root',
          },
        },
        category: 'suporte',
        niche: 'advocacia',
        active: true,
        order: 3,
      },
      overrideAccess: true,
    }),
    payload.create({
      collection: 'faqs',
      data: {
        question: 'Os dados estão em conformidade com o RGPD?',
        answer: {
          root: {
            children: [
              {
                children: [
                  {
                    text: 'Sim, toda a infraestrutura está alojada na Europa (Alemanha) e cumpre integralmente o RGPD. Dispomos de DPA disponível para assinatura.',
                  },
                ],
                type: 'paragraph',
              },
            ],
            type: 'root',
          },
        },
        category: 'direitos',
        niche: 'advocacia',
        active: true,
        order: 4,
      },
      overrideAccess: true,
    }),
  ])

  console.log(`✅ Created ${faqs.length} FAQs`)

  // ============================================
  // 8. Create Proposal Template
  // ============================================
  console.log('📝 Creating proposal template...')

  const template = await payload.create({
    collection: 'proposal-templates',
    data: {
      name: 'Template Advocacia Standard',
      description: 'Template padrão para escritórios de advocacia',
      category: 'itServices',
      niche: 'advocacia',
      defaultHero: {
        title: 'A Nova Era Digital da {{companyName}}',
        description: 'Assuma a soberania total dos seus dados.',
      },
      defaultDiagnostic: {
        problem: 'Processos manuais morosos e falta de presença digital estruturada.',
        solution: 'Implementação de motores automatizados com foco em SEO e conversão.',
      },
      defaultMotores: motores.slice(0, 3).map((m) => m.id),
      defaultAddons: addons.slice(0, 2).map((a) => a.id),
      defaultTestimonials: testimonials.map((t) => t.id),
      defaultTeam: teamMembers.map((t) => t.id),
      defaultFaqs: faqs.map((f) => f.id),
      defaultPricing: {
        setupPrice: 2500,
        monthlyBase: 500,
        setupLabel: 'Alinhado',
        tiers: [
          {
            name: 'Express',
            setupPrice: 1500,
            monthlyPrice: 350,
            features: [
              { feature: 'Payload CMS Pro' },
              { feature: '2 Motores' },
              { feature: 'Suporte email' },
            ],
            recommended: false,
          },
          {
            name: 'Alinhado',
            setupPrice: 2500,
            monthlyPrice: 500,
            features: [
              { feature: 'Payload CMS Pro' },
              { feature: '3 Motores' },
              { feature: 'Integração SIGA' },
              { feature: 'Suporte prioritário' },
            ],
            recommended: true,
          },
          {
            name: 'Premium',
            setupPrice: 4000,
            monthlyPrice: 800,
            features: [
              { feature: 'Payload CMS Enterprise' },
              { feature: 'Todos os Motores' },
              { feature: 'Chatbot incluído' },
              { feature: 'Dedicated Success Manager' },
            ],
            recommended: false,
          },
        ],
      },
      defaultRoadmap: [
        {
          phase: 1,
          title: 'Setup Inicial',
          duration: 'Semana 1-2',
          agencyTasks: [
            { task: 'Configuração do ambiente' },
            { task: 'Setup do CMS' },
            { task: 'Integração de branding' },
          ],
          clientTasks: [
            { task: 'Fornecer assets de branding' },
            { task: 'Validar configurações' },
          ],
        },
        {
          phase: 2,
          title: 'Implementação de Motores',
          duration: 'Semana 3-4',
          agencyTasks: [
            { task: 'Configurar motores selecionados' },
            { task: 'Importar conteúdo inicial' },
            { task: 'Setup de automações' },
          ],
          clientTasks: [
            { task: 'Fornecer conteúdo' },
            { task: 'Rever e aprovar' },
          ],
        },
        {
          phase: 3,
          title: 'Go Live',
          duration: 'Semana 5',
          agencyTasks: [
            { task: 'Testes finais' },
            { task: 'DNS e domínio' },
            { task: 'Formação da equipa' },
          ],
          clientTasks: [
            { task: 'Validar testes' },
            { task: 'Equipar disponível para formação' },
          ],
        },
      ],
      active: true,
      order: 1,
    },
    overrideAccess: true,
  })

  console.log(`✅ Created template: ${template.name}`)

  // ============================================
  // 9. Create Sample Proposal
  // ============================================
  console.log('📄 Creating sample proposal...')

  const sampleProposal = await payload.create({
    collection: 'proposals',
    data: {
      title: 'Proposta VdA 2024',
      slug: 'vda-2024',
      status: 'draft',
      versionType: 'complete',
      client: {
        name: 'Vieira de Almeida',
        email: 'contacto@vda.pt',
        company: 'Vieira de Almeida & Associados',
        phone: '+351 21 123 4567',
      },
      hero: {
        title: 'A Nova Era Digital da VdA',
        description: 'Assuma a soberania total dos seus dados.',
      },
      diagnostic: {
        problem: 'Sistemas dispersos, processos manuais, falta de presença digital estruturada.',
        solution: 'Implementação integrada de motores com foco em eficiência e autoridade digital.',
      },
      motoresIncluidos: motores.slice(0, 3).map((m) => m.id),
      addonsDisponiveis: addons.map((a) => a.id),
      pricing: {
        setupPrice: 2500,
        monthlyBase: 500,
        setupLabel: 'Alinhado',
        tiers: template.defaultPricing?.tiers || [],
      },
      roadmapPhases: template.defaultRoadmap || [],
      testimonials: testimonials.map((t) => t.id),
      team: teamMembers.map((t) => t.id),
      faqs: faqs.map((f) => f.id),
      template: template.id,
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
    },
    overrideAccess: true,
  })

  console.log(`✅ Created sample proposal: ${sampleProposal.title}`)

  // ============================================
  // Summary
  // ============================================
  console.log('\n🎉 Seed completed successfully!')
  console.log('\n📋 Summary:')
  console.log(`   • Tenant: ${alinhadamenteTenant.name}`)
  console.log(`   • Super Admin: ${superAdmin.email}`)
  console.log(`   • Team Members: ${teamMembers.length}`)
  console.log(`   • Motores: ${motores.length}`)
  console.log(`   • Addons: ${addons.length}`)
  console.log(`   • Testimonials: ${testimonials.length}`)
  console.log(`   • FAQs: ${faqs.length}`)
  console.log(`   • Templates: 1`)
  console.log(`   • Sample Proposal: 1`)
  console.log('\n⚠️  Remember to change the super admin password!')
  console.log('   Email: admin@alinhadamente.pt')
  console.log('   Password: ChangeMe123!')

  process.exit(0)
}

seed().catch((error) => {
  console.error('❌ Seed failed:', error)
  process.exit(1)
})
