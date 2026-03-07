
// Payment Modality Types
export type PaymentModality = 'monthly' | 'annual';

export interface RichText {
  [key: string]: any;
}

export interface ClientData {
  name: string;
  email: string;
  company?: string;
  phone?: string;
}

export interface ProposalHero {
  title: string;
  description?: string;
  loomUrl?: string;
  thumbnailImage?: string;
}

export interface ProposalDiagnostic {
  problem?: string;
  solution?: string;
  problemLabel?: string;
  solutionLabel?: string;
}

export interface CmsMotorFeature {
  feature_text: string;
}

export interface CmsMotor {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  features?: CmsMotorFeature[];
}

export interface AddOn {
  id: string;
  slug: string;
  name: string;
  setup_price: number;
  monthly_price: number;
  description?: string;
  hours_saved?: number;
  retention_boost?: number;
  detailed_solution?: string;
  roi_impact?: string;
  third_party_costs?: string;
}

export interface PricingFeature {
  text: string;
  tooltip?: string;
}

export interface PricingTier {
  id: string;
  name: string;
  setup_price: number;
  monthly_price: number;
  features: PricingFeature[];
  recommended?: boolean;
}

export interface ProposalPricing {
  setupPrice: number; // Fallback/Base if tiers not used
  monthlyBase: number; // Fallback/Base if tiers not used
  tiers?: PricingTier[];
}

export interface RoadmapPhase {
  phase: number;
  title: string;
  duration: string;
  agency_tasks: string[];
  client_tasks: string[];
}

export interface Testimonial {
  id: string;
  client_name: string;
  role: string;
  company: string;
  quote: string;
  logo_url?: string;
  photo_url?: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  image_url?: string;
  email?: string;
  linkedin?: string;
}

export interface Faq {
  question: string;
  answer: string;
  category?: string;
}

export interface IncludedItem {
  id: string;
  icon: string;
  title: string;
  subtitle: string;
  features: string[];
  order?: number;
}

export interface VariableCost {
  id: string;
  name: string;
  estimated_cost: number;
  description: string;
  required: boolean;
}

export interface SiteConfig {
  siteName: string;
  contact: {
    email: string;
    whatsapp?: string;
  };
  footer: {
    copyright: string;
  };
}

// Proposal preview from /exists endpoint (for auth flow)
export interface ProposalPreview {
  exists: boolean;
  title: string;
  clientName: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  validUntil?: string;
}

// Auth error types
export interface AuthError {
  type: 'invalid_code' | 'expired' | 'not_found' | 'network' | 'unknown';
  message: string;
}

// Auth state for the app
export interface AuthState {
  isAuthenticated: boolean;
  accessPass: string | null;
  proposalPreview: ProposalPreview | null;
  error: AuthError | null;
}

export interface Proposal {
  id: string;
  slug: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  version_type: 'express' | 'complete' | 'both';
  public_token: string;
  
  client: ClientData;
  hero: ProposalHero;
  diagnostic?: ProposalDiagnostic;
  
  motores_incluidos?: CmsMotor[];
  addons_disponiveis?: AddOn[];
  
  pricing: ProposalPricing;
  
  roadmap_phases?: RoadmapPhase[];
  testimonials?: Testimonial[];
  team?: TeamMember[];
  faqs?: Faq[];
  
  included_items?: IncludedItem[];
  variable_costs?: VariableCost[];
  
  valid_until?: string;
}
