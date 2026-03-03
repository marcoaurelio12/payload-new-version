/**
 * API Service for Payload CMS Backend Integration
 *
 * Handles all API calls to the Payload CMS backend for proposals.
 */

import type { Proposal, SiteConfig, PricingTier, AddOn, CmsMotor, RoadmapPhase, Testimonial, TeamMember, Faq, IncludedItem, VariableCost, ProposalDiagnostic, ProposalHero, RichText, ProposalPreview } from '../types';
import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

/**
 * Convert Payload CMS RichText (Lexical) to HTML using the official converter
 */
function richTextToHtml(richText: RichText | undefined | null): string | undefined {
  if (!richText) return undefined;

  // If already a string, return it
  if (typeof richText === 'string') return richText;

  try {
    // Use official Payload CMS converter for Lexical editor state
    return convertLexicalToHTML({ data: richText });
  } catch {
    return undefined;
  }
}

// API Response Types (matching backend Payload CMS structure)
export interface ApiProposal {
  id: number;
  tenant: {
    id: number;
    name: string;
    slug: string;
    settings?: {
      logo?: { url: string };
      primaryColor?: string;
      companyEmail?: string;
      companyPhone?: string;
    };
  };
  title: string;
  slug: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  versionType?: 'express' | 'complete' | 'both';
  publicToken?: string;
  client: {
    name: string;
    email: string;
    company?: string;
    phone?: string;
  };
  hero?: {
    title: string;
    description?: string;
    loomUrl?: string;
    thumbnailImage?: string | { url: string };
  };
  diagnostic?: {
    problem?: string;
    solution?: string;
    problemLabel?: string;
    solutionLabel?: string;
  };
  validUntil?: string;
  content?: RichText;
  pricing?: {
    setupPrice?: number;
    monthlyBase?: number;
    setupLabel?: string;
    tiers?: Array<{
      id?: string;
      name: string;
      setupPrice: number;       // camelCase from backend
      monthlyPrice: number;     // camelCase from backend
      features: Array<{ feature: string }>;  // Nested objects from backend
      recommended?: boolean;
    }>;
    items?: Array<{
      id: string;
      name: string;
      description?: string;
      price: number;
      frequency: 'once' | 'monthly' | 'yearly';
      optional: boolean;
      selected: boolean;
    }>;
    discount?: number;
    notes?: RichText;
  };
  motoresIncluidos?: Array<{
    id: string;
    slug: string;
    title: string;
    description: string;
    icon: string;
    features?: Array<{ featureText: string }>;  // camelCase from backend
  }>;
  addonsDisponiveis?: Array<{
    id?: string;
    slug: string;
    name: string;
    setupPrice: number;            // camelCase from backend
    monthlyPrice: number;          // camelCase from backend
    description?: string;
    hoursSaved?: number;           // camelCase from backend
    retentionBoost?: number;       // camelCase from backend
    detailedSolution?: RichText;   // RichText from backend
    roiImpact?: RichText;          // RichText from backend
    thirdPartyCosts?: RichText;    // RichText from backend
  }>;
  roadmapPhases?: Array<{
    phase: number;
    title: string;
    duration: string;
    agencyTasks: Array<{ task: string }>;   // Nested objects from backend
    clientTasks: Array<{ task: string }>;   // Nested objects from backend
  }>;
  testimonials?: Array<{
    id: string;
    client_name: string;
    role: string;
    company: string;
    quote: string;
    logo_url?: string;
    photo_url?: string;
  }>;
  team?: Array<{
    id: string;
    name: string;
    role: string;
    bio: string;
    image_url?: string;
    email?: string;
    linkedin?: string;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
    category?: string;
  }>;
  includedItems?: Array<{
    id?: string;
    icon: string;
    title: string;
    subtitle?: string;
    features: Array<{ featureText: string }>;  // Nested objects from backend
    order?: number;
  }>;
  variableCosts?: Array<{
    id: string;
    name: string;
    estimated_cost: number;
    description: string;
    required: boolean;
  }>;
  sentAt?: string;
  viewedAt?: string;
  respondedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiError {
  message: string;
  status?: number;
}

/**
 * Transform API response to frontend Proposal format
 */
export function transformApiProposal(apiProposal: ApiProposal): { proposal: Proposal; siteConfig: SiteConfig } {
  // Map CMS motors - Transform featureText → feature_text
  const motores_incluidos: CmsMotor[] = (apiProposal.motoresIncluidos || []).map(m => ({
    id: m.id,
    slug: m.slug,
    title: m.title,
    description: m.description,
    icon: m.icon,
    features: m.features?.map(f => ({ feature_text: f.featureText })) || []
  }));

  // Map add-ons - Transform camelCase to snake_case and convert RichText to HTML
  const addons_disponiveis: AddOn[] = (apiProposal.addonsDisponiveis || []).map(a => ({
    id: a.id || '',
    slug: a.slug,
    name: a.name,
    setup_price: a.setupPrice,
    monthly_price: a.monthlyPrice,
    description: a.description,
    hours_saved: a.hoursSaved,
    retention_boost: a.retentionBoost,
    detailed_solution: richTextToHtml(a.detailedSolution),
    roi_impact: richTextToHtml(a.roiImpact),
    third_party_costs: richTextToHtml(a.thirdPartyCosts)
  }));

  // Map pricing - Transform backend structure to frontend format
  const pricing = {
    setupPrice: apiProposal.pricing?.setupPrice || 0,
    monthlyBase: apiProposal.pricing?.monthlyBase || 0,
    tiers: apiProposal.pricing?.tiers?.map(tier => ({
      id: tier.id || '',
      name: tier.name,
      setup_price: tier.setupPrice,      // camelCase → snake_case
      monthly_price: tier.monthlyPrice,  // camelCase → snake_case
      features: tier.features?.map(f => f.feature) || [],  // [{feature: "x"}] → ["x"]
      recommended: tier.recommended
    })) as PricingTier[] | undefined
  };

  // Map roadmap phases - Transform nested objects to strings
  const roadmap_phases: RoadmapPhase[] = (apiProposal.roadmapPhases || []).map(r => ({
    phase: r.phase,
    title: r.title,
    duration: r.duration,
    agency_tasks: r.agencyTasks?.map(t => t.task) || [],
    client_tasks: r.clientTasks?.map(t => t.task) || []
  }));

  // Map testimonials
  const testimonials: Testimonial[] = (apiProposal.testimonials || []).map(t => ({
    id: t.id,
    client_name: t.client_name,
    role: t.role,
    company: t.company,
    quote: t.quote,
    logo_url: t.logo_url,
    photo_url: t.photo_url
  }));

  // Map team
  const team: TeamMember[] = (apiProposal.team || []).map(t => ({
    id: t.id,
    name: t.name,
    role: t.role,
    bio: t.bio,
    image_url: t.image_url,
    email: t.email,
    linkedin: t.linkedin
  }));

  // Map FAQs
  const faqs: Faq[] = (apiProposal.faqs || []).map(f => ({
    question: f.question,
    answer: f.answer,
    category: f.category
  }));

  // Map included items - Transform nested objects to strings
  const included_items: IncludedItem[] = (apiProposal.includedItems || []).map(i => ({
    id: i.id || '',
    icon: i.icon,
    title: i.title,
    subtitle: i.subtitle || '',
    features: i.features?.map(f => f.featureText) || [],
    order: i.order
  }));

  // Map variable costs
  const variable_costs: VariableCost[] = (apiProposal.variableCosts || []).map(v => ({
    id: v.id,
    name: v.name,
    estimated_cost: v.estimated_cost,
    description: v.description,
    required: v.required
  }));

  // Map diagnostic
  const diagnostic: ProposalDiagnostic | undefined = apiProposal.diagnostic ? {
    problem: apiProposal.diagnostic.problem,
    solution: apiProposal.diagnostic.solution,
    problemLabel: apiProposal.diagnostic.problemLabel,
    solutionLabel: apiProposal.diagnostic.solutionLabel
  } : undefined;

  // Map hero
  const hero: ProposalHero = apiProposal.hero ? {
    title: apiProposal.hero.title,
    description: apiProposal.hero.description,
    loomUrl: apiProposal.hero.loomUrl,
    thumbnailImage: typeof apiProposal.hero.thumbnailImage === 'string'
      ? apiProposal.hero.thumbnailImage
      : apiProposal.hero.thumbnailImage?.url
  } : {
    title: apiProposal.title
  };

  // Build Proposal
  const proposal: Proposal = {
    id: String(apiProposal.id),
    slug: apiProposal.slug,
    status: apiProposal.status,
    version_type: apiProposal.versionType || 'complete',
    public_token: apiProposal.publicToken || '',
    client: apiProposal.client,
    hero,
    diagnostic,
    motores_incluidos,
    addons_disponiveis,
    pricing,
    roadmap_phases,
    testimonials,
    team,
    faqs,
    included_items,
    variable_costs,
    valid_until: apiProposal.validUntil
  };

  // Build SiteConfig from tenant
  const siteConfig: SiteConfig = {
    siteName: apiProposal.tenant.name,
    contact: {
      email: apiProposal.tenant.settings?.companyEmail || 'geral@alinhadamente.pt',
      whatsapp: apiProposal.tenant.settings?.companyPhone
    },
    footer: {
      copyright: `© ${new Date().getFullYear()} ${apiProposal.tenant.name}. Todos os direitos reservados.`
    }
  };

  return { proposal, siteConfig };
}

/**
 * Fetch a proposal by its slug
 * Uses the public endpoint that doesn't require authentication
 */
export async function fetchProposalBySlug(slug: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Proposta não encontrada');
    }
    throw new Error(`Erro ao carregar proposta: ${response.status}`);
  }

  return response.json();
}

/**
 * Fetch a proposal by its unique token
 * Useful for sharing links
 */
export async function fetchProposalByToken(token: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/token/${token}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Proposta não encontrada');
    }
    throw new Error(`Erro ao carregar proposta: ${response.status}`);
  }

  return response.json();
}

/**
 * Accept a proposal
 */
export async function acceptProposal(slug: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao aceitar proposta');
  }

  return response.json();
}

/**
 * Reject a proposal
 */
export async function rejectProposal(slug: string, reason?: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ reason }),
  });

  if (!response.ok) {
    throw new Error('Erro ao rejeitar proposta');
  }

  return response.json();
}

// =====================
// AUTHENTICATION FLOW API
// =====================

/**
 * Check if proposal exists and get preview info
 * GET /api/proposals/public/{slug}/exists
 */
export async function checkProposalExists(slug: string): Promise<ProposalPreview> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/exists`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Proposta não encontrada');
    }
    throw new Error('Erro ao verificar proposta');
  }

  return response.json();
}

/**
 * Verify access code and get full proposal data
 * POST /api/proposals/public/{slug}/verify
 * Body: { accessPass: string }
 */
export async function verifyProposalAccess(slug: string, accessPass: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/verify`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessPass }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Código de acesso incorreto');
    }
    if (response.status === 410) {
      throw new Error('Esta proposta expirou');
    }
    throw new Error('Erro ao verificar código');
  }

  return response.json();
}

/**
 * Accept proposal with access code
 * POST /api/proposals/public/{slug}/accept
 * Body: { accessPass: string }
 */
export async function acceptProposalWithAuth(slug: string, accessPass: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/accept`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessPass }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Código de acesso inválido');
    }
    throw new Error('Erro ao aceitar proposta');
  }

  return response.json();
}

/**
 * Reject proposal with access code
 * POST /api/proposals/public/{slug}/reject
 * Body: { accessPass: string, reason?: string }
 */
export async function rejectProposalWithAuth(slug: string, accessPass: string, reason?: string): Promise<ApiProposal> {
  const response = await fetch(`${API_URL}/api/proposals/public/${slug}/reject`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ accessPass, reason }),
  });

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error('Código de acesso inválido');
    }
    throw new Error('Erro ao rejeitar proposta');
  }

  return response.json();
}
