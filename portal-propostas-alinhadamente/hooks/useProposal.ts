
import { useState, useEffect } from 'react';
import { Proposal, SiteConfig } from '../types';
import { fetchProposalBySlug, fetchProposalByToken, transformApiProposal } from '../services/api';

// =====================
// MOCK DATA (Fallback)
// =====================

const MOCK_PROPOSAL: Proposal = {
  id: 'prop_123',
  slug: 'vda-sovereign-2026',
  status: 'sent',
  version_type: 'complete',
  public_token: 'xyz-token-123',
  client: {
    name: 'Dr. João Mendes',
    email: 'jm@vda.pt',
    company: 'VdA & Associados'
  },
  hero: {
    title: 'A Nova Era Digital da VdA',
    description: 'Assuma a soberania total dos seus dados. Infraestrutura dedicada, código open-source e performance de elite.',
    loomUrl: 'https://www.loom.com/share/mock-video-id',
    thumbnailImage: 'https://picsum.photos/seed/legaltech/1200/600'
  },
  diagnostic: {
    problemLabel: 'Cenário Atual',
    problem: 'Dados dispersos em plataformas SaaS de terceiros (custo oculto de lock-in e risco de RGPD).',
    solutionLabel: 'Cenário Alinhadamente',
    solution: 'Infraestrutura própria (VPS) com Payload CMS e propriedade intelectual 100% da Sociedade.'
  },
  pricing: {
    setupPrice: 1500,
    monthlyBase: 95,
    tiers: [
      {
        id: 'essencial',
        name: 'Essencial',
        setup_price: 900,
        monthly_price: 45,
        features: ['Payload CMS Base', '1 Motor (Artigos)', 'Hosting Partilhado']
      },
      {
        id: 'alinhado',
        name: 'Alinhado',
        setup_price: 1500,
        monthly_price: 95,
        recommended: true,
        features: ['Payload CMS Pro', '3 Motores', 'Hosting Dedicado (VPS)', 'Suporte Prioritário']
      },
      {
        id: 'premium',
        name: 'Premium',
        setup_price: 2800,
        monthly_price: 250,
        features: ['Infraestrutura Multi-Região', 'Todos os Motores', 'SLA 99.9%', 'Audit Logs']
      }
    ]
  },
  motores_incluidos: [
    {
      id: 'm1',
      slug: 'artigos',
      title: 'Motor de Artigos',
      description: 'Gestão de autoridade jurídica com SEO otimizado e curadoria de conteúdos.',
      icon: 'document',
      features: [{ feature_text: 'Gestão via Payload CMS' }, { feature_text: 'SEO Automático' }]
    },
    {
      id: 'm2',
      slug: 'equipa',
      title: 'Diretório de Sócios',
      description: 'Gestão hierárquica de perfis para associados e sócios.',
      icon: 'usergroup',
      features: [{ feature_text: 'Links LinkedIn' }, { feature_text: 'V-Card Download' }]
    }
  ],
  addons_disponiveis: [
    {
      id: 'a1',
      slug: 'seo-agent',
      name: 'Agente SEO Blog',
      setup_price: 250,
      monthly_price: 0,
      description: 'Otimização automática para nicho jurídico PT.',
      hours_saved: 8,
      retention_boost: 10,
      detailed_solution: 'Implementação de agente IA para análise de tendências jurídicas e sugestão de pautas.',
      roi_impact: 'Crescimento orgânico sustentável sem agência externa.',
      third_party_costs: 'Incluído'
    },
    {
      id: 'a2',
      slug: 'cal-com',
      name: 'Agendamento (Cal.com)',
      setup_price: 150,
      monthly_price: 15,
      description: 'Integração completa para marcação de consultas.',
      hours_saved: 5,
      retention_boost: 15,
      detailed_solution: 'Self-hosted Cal.com para garantir que os dados dos clientes não saem do servidor.',
      roi_impact: 'Redução de 90% na troca de emails para agendar.',
      third_party_costs: 'Zero (Self-hosted)'
    }
  ],
  roadmap_phases: [
    {
      phase: 1,
      title: "Setup Inicial",
      duration: "Semana 1-2",
      agency_tasks: ["Provisionamento de VPS", "Instalação Payload CMS", "Configuração DNS"],
      client_tasks: ["Envio de Kit de Marca (Logo/Cores)", "Acesso ao DNS Atual"]
    },
    {
      phase: 2,
      title: "Desenvolvimento & Migração",
      duration: "Semana 3-5",
      agency_tasks: ["Desenvolvimento de Motores", "Migração de Artigos", "SEO Técnico"],
      client_tasks: ["Validação de Design", "Envio de Conteúdos Base"]
    },
    {
      phase: 3,
      title: "Go-Live",
      duration: "Semana 6",
      agency_tasks: ["Testes de Carga", "Treino da Equipa", "Lançamento"],
      client_tasks: ["Aprovação Final", "Comunicação Interna"]
    }
  ],
  testimonials: [],
  team: [
    {
      id: 't1',
      name: 'Carlos Alinhado',
      role: 'CTO & Fundador',
      bio: 'Especialista em Soberania Digital.',
      image_url: 'https://picsum.photos/seed/carlos/200'
    }
  ],
  faqs: [
    {
      question: "Qual o prazo de entrega?",
      answer: "Tipicamente 4 a 6 semanas após recepção dos conteúdos.",
      category: "Suporte"
    },
    {
      question: "Os dados ficam em Portugal?",
      answer: "Os servidores estão localizados na Alemanha (Hetzner), ao abrigo do RGPD.",
      category: "Direitos"
    }
  ],
  variable_costs: [
    {
      id: 'vc1',
      name: 'Domínio (.pt)',
      estimated_cost: 15,
      description: 'Valor anual pago diretamente à DNS.pt.',
      required: true
    },
    {
      id: 'vc2',
      name: 'VPS Hetzner',
      estimated_cost: 6,
      description: 'Custo mensal do servidor (pago diretamente ao provider).',
      required: true
    }
  ],
  included_items: [
    {
      id: 'inc1',
      icon: 'server',
      title: 'Infraestrutura Dedicada',
      subtitle: 'VPS Hetzner',
      features: ['IP Dedicado', 'Backups Diários']
    },
    {
      id: 'inc2',
      icon: 'bolt',
      title: 'Motores CMS',
      subtitle: 'Artigos & Equipa',
      features: ['SEO Nativo', 'Gestão de Perfis']
    }
  ]
};

const MOCK_SITE_CONFIG: SiteConfig = {
  siteName: 'Alinhadamente',
  contact: {
    email: 'geral@alinhadamente.pt',
    whatsapp: '351910000000'
  },
  footer: {
    copyright: '© 2026 Alinhadamente. Digital Sovereignty Enforcement.'
  }
};

// =====================
// USE PROPOSAL HOOK
// =====================

interface UseProposalOptions {
  useMock?: boolean;
}

/**
 * Hook to fetch proposal data from API or use mock data
 * @param identifier - The proposal slug or token
 * @param options - Configuration options
 */
export const useProposal = (
  identifier?: string,
  options: UseProposalOptions = {}
) => {
  const { useMock = false } = options;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // If no identifier or explicitly using mock, return mock data
        if (!identifier || useMock) {
          await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network
          setProposal(MOCK_PROPOSAL);
          setSiteConfig(MOCK_SITE_CONFIG);
          setLoading(false);
          return;
        }

        // Try to detect if identifier is a token (longer, random string) or slug (shorter, readable)
        const isToken = identifier.length > 20 && /^[a-zA-Z0-9]+$/.test(identifier);

        let apiResponse;
        if (isToken) {
          apiResponse = await fetchProposalByToken(identifier);
        } else {
          apiResponse = await fetchProposalBySlug(identifier);
        }

        // Transform API response to frontend format
        const { proposal: transformedProposal, siteConfig: transformedConfig } = transformApiProposal(apiResponse);

        setProposal(transformedProposal);
        setSiteConfig(transformedConfig);
      } catch (err) {
        console.error('Failed to fetch proposal:', err);

        // Fallback to mock data in development
        if (import.meta.env.DEV) {
          console.warn('Falling back to mock data');
          setProposal(MOCK_PROPOSAL);
          setSiteConfig(MOCK_SITE_CONFIG);
        } else {
          setError(err as Error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [identifier, useMock]);

  return { proposal, siteConfig, loading, error };
};

/**
 * Hook to get slug from URL path
 * Assumes URL structure like: /proposal/:slug or /:slug or /o/:slug or /p/:slug
 */
export const useProposalSlugFromUrl = (): string | null => {
  const [slug, setSlug] = useState<string | null>(null);

  useEffect(() => {
    const path = window.location.pathname;

    // Match patterns: /p/slug (protected), /o/slug, /proposal/slug, /slug
    // All patterns support optional trailing slash for Cloudflare Pages URL normalization
    const patterns = [
      /^\/p\/([^/]+)\/?/,       // /p/:slug (protected route - requires auth)
      /^\/o\/([^/]+)\/?/,       // /o/:slug
      /^\/proposal\/([^/]+)\/?/, // /proposal/:slug
      /^\/([^/]+)\/?$/          // /:slug (root level)
    ];

    for (const pattern of patterns) {
      const match = path.match(pattern);
      if (match && match[1]) {
        setSlug(match[1]);
        return;
      }
    }

    setSlug(null);
  }, []);

  return slug;
};

/**
 * Hook to check if current route is a protected route (requires authentication)
 */
export const useIsProtectedRoute = (): boolean => {
  const [isProtected, setIsProtected] = useState(false);

  useEffect(() => {
    setIsProtected(window.location.pathname.startsWith('/p/'));
  }, []);

  return isProtected;
};

export default useProposal;
