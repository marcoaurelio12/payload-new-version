import React, { useState, useEffect, useMemo } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  CloudIcon,
  ArrowRightIcon,
  CheckIcon,
  SparklesIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowTrendingUpIcon,
  PlusIcon,
  MinusIcon,
  InformationCircleIcon,
  ChevronDownIcon,
  UserIcon,
  BuildingOffice2Icon,
  BoltIcon
} from '@heroicons/react/24/outline';
import { useProposal, useProposalSlugFromUrl } from './hooks/useProposal';
import Logo from './components/Logo';
import ErrorScreen from './components/ErrorScreen';
import PaymentModalityToggle from './components/PaymentModalityToggle';

// ============================================
// TYPES
// ============================================
type PaymentModality = 'monthly' | 'annual';

interface PricingTier {
  id: string;
  name: string;
  setup_price: number;
  monthly_price: number;
  features: string[];
  recommended?: boolean;
}

interface AddOn {
  id: string;
  name: string;
  description: string;
  setup_price: number;
  monthly_price: number;
  hours_saved?: number;
  retention_boost?: number;
  roi_impact?: string;
  detailed_solution?: string;
}

interface RoadmapPhase {
  phase: string;
  title: string;
  duration: string;
  agency_tasks: string[];
  client_tasks: string[];
}

interface Diagnostic {
  problemLabel?: string;
  solutionLabel?: string;
  problem: string;
  solution: string;
}

interface Faq {
  question: string;
  answer: string;
}

interface VariableCost {
  id: string;
  name: string;
  estimated_cost: string;
  description: string;
  required: boolean;
}

interface CmsMotor {
  id: string;
  title: string;
  description: string;
  icon: string;
  features?: { feature_text: string }[];
}

interface Proposal {
  slug: string;
  version_type: 'express' | 'complete' | 'both';
  client: {
    name: string;
  };
  hero: {
    title: string;
    description?: string;
    loomUrl?: string;
    thumbnailImage?: string;
  };
  pricing: {
    setupPrice: number;
    monthlyBase: number;
    tiers?: PricingTier[];
  };
  addons_disponiveis?: AddOn[];
  roadmap_phases?: RoadmapPhase[];
  diagnostic?: Diagnostic;
  faqs?: Faq[];
  variable_costs?: VariableCost[];
  motores_incluidos?: CmsMotor[];
  team?: {
    name: string;
    image_url?: string;
  }[];
}

// ============================================
// CONSTANTS - Icon Mapping
// ============================================
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  code: CodeBracketIcon,
  shield: ShieldCheckIcon,
  cloud: CloudIcon,
};

const getIcon = (iconName: string) => {
  const IconComponent = ICON_MAP[iconName] || CodeBracketIcon;
  return <IconComponent className="w-8 h-8" />;
};

// ============================================
// HEADER COMPONENT
// ============================================
const NAV_LINKS = [
  { id: 'solucao', label: 'Solução' },
  { id: 'roadmap', label: 'Plano' },
  { id: 'investimento', label: 'Investimento' },
];

const Header: React.FC<{
  currentPage: 'proposal' | 'onboarding';
  onNavigate: (page: 'proposal' | 'onboarding') => void;
}> = ({ currentPage, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollTo = (id: string) => {
    if (currentPage !== 'proposal') {
      onNavigate('proposal');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate('proposal')}
        >
          <Logo height={32} />
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-primary dark:text-gray-1 dark:hover:text-primary transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-500 hover:text-gray-900 dark:text-gray-1/60 dark:hover:text-white transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-lg"
            title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
          </button>

          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border border-primary/30 bg-primary/5">
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse-green"></div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Válida</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================
// HERO COMPONENT
// ============================================
const Hero: React.FC<{ proposal: Proposal }> = ({ proposal }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-8 leading-tight tracking-tight transition-colors">
          {proposal.hero.title}
        </h1>
        {proposal.hero.description && (
          <p className="text-xl text-gray-600 dark:text-gray-1 mb-10 leading-relaxed font-light transition-colors">
            {proposal.hero.description}
        )}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-primary text-gray-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform"
          >
            Explorar Solução
          </button>
                      </p>
        </div>
      </motion.div>

      {proposal.hero.loomUrl && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-primary rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-2xl border-2 border-primary bg-black overflow-hidden shadow-2xl aspect-video">
            <img
              src={proposal.hero.thumbnailImage || "https://picsum.photos/seed/legaltech/800/450"}
              alt="Video Overview"
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a
                href={proposal.hero.loomUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-20 h-20 rounded-full bg-primary flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
              >
                <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-white text-xs font-mono">Ver Apresentação</span>
            </div>
          </div>
        </motion.div>
      )}
                      </p>
    </div>
  );
};

// ============================================
// TRUST BAR COMPONENT
// ============================================
const TrustBar: React.FC = () => {
  const badgeData = [
    { icon: CodeBracketIcon, text1: 'Sem Vendor Lock-in', text2: 'Stack Open Source' },
    { icon: ShieldCheckIcon, text1: 'GDPR Compliant', text2: 'Dados em Solo Europeu' },
    { icon: CloudIcon, text1: 'Soberania Digital', text2: 'Infraestrutura Dedicada' }
  ];

  return (
    <div className="w-full border-y border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badgeData.map((badge, idx) => (
            <div key={idx} className="flex items-center justify-center space-x-3 opacity-60 hover:opacity-100 transition-opacity">
              <badge.icon className="w-6 h-6 text-primary" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-900 dark:text-white font-bold uppercase tracking-wider transition-colors">
                  {badge.text1}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-gray-1 hidden sm:block transition-colors">
                  {badge.text2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DIAGNOSTIC SECTION COMPONENT
// ============================================
const DiagnosticSection: React.FC<{ diagnostic: Diagnostic }> = ({ diagnostic }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 transition-colors">
      {/* Problem Side */}
      <div className="bg-red-50 dark:bg-red-900/10 p-12 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 relative transition-colors">
        <div className="absolute top-6 left-6 px-3 py-1 bg-red-500/10 dark:bg-red-500/20 rounded-full border border-red-500/20 dark:border-red-500/30">
          <span className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-widest">Cenário Atual</span>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-white/80 mb-4 transition-colors">
            {diagnostic.problemLabel || 'Desafios & Riscos'}
          </h3>
          <p className="text-gray-600 dark:text-gray-1 leading-relaxed font-mono text-sm opacity-80 transition-colors">
            {diagnostic.problem}
        </div>
      </div>

      {/* Solution Side */}
      <div className="bg-primary/5 p-12 relative transition-colors">
        <div className="absolute top-6 left-6 px-3 py-1 bg-primary/20 rounded-full border border-primary/30">
          <span className="text-[10px] text-primary font-black uppercase tracking-widest">Cenário Alinhadamente</span>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            {diagnostic.solutionLabel || 'Soberania & Performance'}
          </h3>
          <p className="text-gray-700 dark:text-white leading-relaxed font-mono text-sm transition-colors">
            {diagnostic.solution}
        </div>
      </div>

      {/* Connector */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-900 p-2 rounded-full border border-black/10 dark:border-white/10 hidden md:block z-10 transition-colors shadow-lg">
        <ArrowRightIcon className="w-6 h-6 text-gray-400 dark:text-gray-1" />
      </div>
    </div>
  );
};

// ============================================
// ROADMAP COMPONENT
// ============================================
const Roadmap: React.FC<{ phases: RoadmapPhase[] }> = ({ phases }) => {
  return (
    <div className="relative">
      {/* Connector Line for Desktop */}
      <div className="absolute left-[50%] top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 hidden md:block transition-colors"></div>

      <div className="space-y-16">
        {phases.map((phase, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24"
          >
            {/* Center Node */}
            <div className="hidden md:flex absolute left-[50%] top-0 -translate-x-1/2 flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-900 border-2 border-primary flex items-center justify-center z-10 transition-colors">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white transition-colors">{phase.phase}</span>
              </div>
              <div className="mt-2 bg-white dark:bg-gray-900 px-2 py-1 rounded border border-primary/30 transition-colors">
                <span className="text-[9px] font-mono text-primary whitespace-nowrap">
                  {phase.duration}
                </span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center space-x-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-gray-900 font-bold text-xs">
                {phase.phase}
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{phase.title}</h4>
              <span className="text-xs text-primary border border-primary/30 px-2 py-0.5 rounded">
                {phase.duration}
              </span>
            </div>

            {/* Left Side: Agency Tasks */}
            <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5 md:text-right relative group hover:border-primary/30 transition-colors">
              <div className="absolute top-4 right-4 md:right-auto md:left-4 opacity-10">
                <BuildingOffice2Icon className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h5 className="text-primary font-bold uppercase text-xs tracking-widest mb-4">Responsabilidade Alinhadamente</h5>
              <ul className="space-y-3">
                {phase.agency_tasks.map((task, tIdx) => (
                  <li key={tIdx} className="text-sm text-gray-600 dark:text-gray-1/80 flex md:flex-row-reverse items-center gap-3 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Client Tasks */}
            <div className="bg-primary/5 p-6 rounded-2xl border border-primary/20 relative group hover:border-primary/50 transition-colors">
              <div className="absolute top-4 right-4 opacity-10">
                <UserIcon className="w-6 h-6 text-primary" />
              </div>
              <h5 className="text-gray-900 dark:text-white font-bold uppercase text-xs tracking-widest mb-4 transition-colors">A Sua Missão</h5>
              <ul className="space-y-3">
                {phase.client_tasks.map((task, tIdx) => (
                  <li key={tIdx} className="text-sm text-gray-600 dark:text-gray-1 flex items-center gap-3 transition-colors">
                    <div className="w-4 h-4 rounded border border-black/10 dark:border-white/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded bg-transparent group-hover:bg-primary transition-colors"></div>
                    </div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// CMS MOTORS COMPONENT
// ============================================
const CmsMotors: React.FC<{ motors: CmsMotor[] }> = ({ motors }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!motors || motors.length === 0) return null;

  return (
    <div className="space-y-4">
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${motors.length < 3 ? 'justify-center' : ''}`}>
        {motors.map((motor) => (
          <motion.div
            key={motor.id}
            layout
            onClick={() => setExpandedId(expandedId === motor.id ? null : motor.id)}
            className={`group relative p-8 bg-white/70 dark:bg-white/5 backdrop-blur rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden border-2 flex flex-col ${
              expandedId === motor.id
                ? 'border-primary bg-gray-50 dark:bg-white/[0.07]'
                : 'border-transparent hover:border-black/5 dark:hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`text-primary transition-transform duration-500 ${expandedId === motor.id ? 'scale-125' : ''}`}>
                {getIcon(motor.icon)}
              </div>
              <motion.div animate={{ rotate: expandedId === motor.id ? 180 : 0 }} className="text-gray-400 dark:text-gray-1/30 transition-colors">
                <ChevronDownIcon className="w-5 h-5" />
              </motion.div>
            </div>

            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight transition-colors">
              {motor.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-1/80 text-sm leading-relaxed mb-4 transition-colors">
              {motor.description}

            <AnimatePresence>
              {expandedId === motor.id && motor.features && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3 transition-colors mt-auto"
                >
                  <p className="text-xs text-primary font-bold uppercase tracking-widest">Capacidades:</p>
                  <ul className="text-xs text-gray-500 dark:text-gray-1/60 space-y-2 transition-colors">
                    {motor.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-primary rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{feature.feature_text}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
                      </p>
      </div>
    </div>
  );
};

// ============================================
// CALCULATOR COMPONENT
// ============================================
const Calculator: React.FC<{
  proposal: Proposal;
  onTotalChange: (setup: number, monthly: number, modality: PaymentModality) => void;
}> = ({ proposal, onTotalChange }) => {
  const defaultTier = proposal.pricing.tiers?.find(t => t.recommended) || proposal.pricing.tiers?.[0];

  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(defaultTier || null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [expandedAddOnId, setExpandedAddOnId] = useState<string | null>(null);
  const [paymentModality, setPaymentModality] = useState<PaymentModality>('annual');

  const tiers = proposal.pricing.tiers || [];
  const addons = proposal.addons_disponiveis || [];

  // Apply payment modality multiplier
  const applyModalityMultiplier = (basePrice: number): number => {
    return paymentModality === 'monthly'
      ? Math.round(basePrice * 1.23)  // 23% markup for monthly
      : basePrice;                     // No markup for annual
  };

  const calculateTotals = () => {
    let baseSetup = 0;
    let baseMonthly = 0;

    if (selectedTier) {
      baseSetup += selectedTier.setup_price;
      baseMonthly += selectedTier.monthly_price;
    } else {
      baseSetup += proposal.pricing.setupPrice;
      baseMonthly += proposal.pricing.monthlyBase;
    }

    const selectedAddonData = addons.filter(a => selectedAddOns.includes(a.id));
    baseSetup += selectedAddonData.reduce((sum, a) => sum + a.setup_price, 0);
    baseMonthly += selectedAddonData.reduce((sum, a) => sum + a.monthly_price, 0);

    // Apply modality multiplier to monthly price
    const displayMonthly = applyModalityMultiplier(baseMonthly);
    const annualTotal = baseMonthly * 12;

    return {
      setup: baseSetup,
      monthly: displayMonthly,
      baseMonthly,      // Original price without markup
      annualTotal       // Annual commitment (base × 12)
    };
  };

  const totals = calculateTotals();

  useEffect(() => {
    onTotalChange(totals.setup, totals.monthly, paymentModality);
  }, [totals.setup, totals.monthly, paymentModality]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const roiStats = addons
    .filter(a => selectedAddOns.includes(a.id))
    .reduce((acc, curr) => ({
      hoursSaved: acc.hoursSaved + (curr.hours_saved || 0),
      retentionBoost: acc.retentionBoost + (curr.retention_boost || 0)
    }), { hoursSaved: 0, retentionBoost: 0 });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl relative transition-colors duration-300">
      <div className="p-8 lg:p-12">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">Investimento</h2>
        <p className="text-gray-600 dark:text-gray-1/60 mb-10 transition-colors">Configure o nível de serviço e os extras da sua infraestrutura.</p>

        {/* STEP 0: PAYMENT MODALITY */}
        <div className="mb-10">
          <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">Modalidade de Pagamento</h3>
          <PaymentModalityToggle
            value={paymentModality}
            onChange={setPaymentModality}
          />
        </div>

        {/* STEP 1: TIERS */}
        {tiers.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-6">1. Escolha o Nível Base</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
              {tiers.map((tier) => {
                const isSelected = selectedTier?.id === tier.id;
                return (
                  <motion.div
                    key={tier.id}
                    layout
                    onClick={() => setSelectedTier(tier)}
                    className={`relative p-8 rounded-2xl border-2 cursor-pointer transition-all duration-300 flex flex-col h-full ${
                      isSelected
                        ? 'border-primary bg-primary/5 z-10 ring-1 ring-primary'
                        : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {tier.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-gray-900 text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <SparklesIcon className="w-3 h-3" />
                        Recomendado
                      </div>
                    )}

                    <div className="flex justify-between items-start mb-6">
                      <h4 className={`text-xl font-bold transition-colors ${isSelected ? 'text-primary' : 'text-gray-900 dark:text-white'}`}>
                        {tier.name}
                      </h4>
                      {isSelected ? (
                        <CheckCircleIcon className="w-6 h-6 text-primary" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-white/20"></div>
                      )}
                      </p>
                    </div>

                    <div className="mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                        {tier.setup_price}€ <span className="text-xs text-gray-400 font-bold uppercase">Setup</span>
                      <p className="text-lg text-gray-500 dark:text-gray-1/60">
                      {paymentModality === 'annual' ? (
                        <>
                          <span className="text-[10px] uppercase font-bold text-primary">{(tier.monthly_price * 12).toLocaleString('pt-PT')}€/ano</span>
                          <span className="mx-1">•</span>
                          <span>{tier.monthly_price}€/mês</span>
                        </>
                      ) : (
                        <>
                          {applyModalityMultiplier(tier.monthly_price)}€ <span className="text-[10px] uppercase font-bold">/mês</span>
                          <span className="ml-2 text-[9px] text-gray-400 font-bold">+23%</span>
                        </>
                      )}
                      </p>
                    </div>

                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-4">
                        O que inclui:
                      </p>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-primary' : 'text-gray-400'}`} />
                            <span className="text-sm text-gray-700 dark:text-gray-1 leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                      isSelected
                        ? 'bg-primary text-gray-900'
                        : 'bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/50'
                    }`}>
                      {isSelected ? 'Selecionado' : 'Selecionar'}
                    </button>
                  </motion.div>
                );
              })}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
          {/* STEP 2: ADDONS */}
          <div className="lg:col-span-3 space-y-6">
            {addons.length > 0 && (
              <>
                <h3 className="text-sm font-bold uppercase tracking-widest text-primary mb-4">2. Adicione Capacidades</h3>

                {/* ROI Dashboard */}
                <AnimatePresence>
                  {selectedAddOns.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="grid grid-cols-2 gap-4 mb-6 overflow-hidden"
                    >
                      <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-center space-x-3">
                        <ClockIcon className="w-8 h-8 text-primary" />
                        <div>
                          <p className="text-[10px] text-primary font-black uppercase tracking-wider">Tempo Poupado</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{roiStats.hoursSaved}h <span className="text-xs text-gray-500 dark:text-white/50">/mês</span></p>
                      </p>
                        </div>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-center space-x-3">
                        <ArrowTrendingUpIcon className="w-8 h-8 text-blue-400" />
                        <div>
                          <p className="text-[10px] text-blue-400 font-black uppercase tracking-wider">Retenção</p>
                          <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">+{roiStats.retentionBoost}%</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="space-y-4">
                  {addons.map((addon) => (
                    <div key={addon.id} className={`group rounded-2xl border-2 transition-all duration-300 overflow-hidden ${selectedAddOns.includes(addon.id) ? 'border-primary bg-primary/5' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'}`}>
                      <div onClick={() => toggleAddOn(addon.id)} className="p-6 flex items-center justify-between cursor-pointer">
                        <div className="flex items-center space-x-5">
                          <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedAddOns.includes(addon.id) ? 'bg-primary' : 'bg-black/10 dark:bg-white/10'}`}>
                            {selectedAddOns.includes(addon.id) && <CheckCircleIcon className="w-5 h-5 text-gray-900" />}
                      </p>
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight transition-colors">{addon.name}</h4>
                              {selectedAddOns.includes(addon.id) && <span className="text-[8px] bg-primary text-gray-900 px-1.5 py-0.5 rounded font-bold uppercase">Ativo</span>}
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); setExpandedAddOnId(expandedAddOnId === addon.id ? null : addon.id); }} className="text-[10px] text-primary font-bold uppercase tracking-widest mt-1 hover:underline">Ver Detalhe & ROI</button>
                          </div>
                        </div>
                        <div className="text-right flex flex-col items-end">
                          <span className="font-bold text-gray-900 dark:text-white">{addon.setup_price} €</span>
                          <span className="text-[10px] opacity-40 text-gray-900 dark:text-white">{addon.monthly_price > 0 ? `+${addon.monthly_price} €/mês` : 'Mensalidade Incluída'}</span>
                        </div>
                      </div>

                      <AnimatePresence>
                        {expandedAddOnId === addon.id && (
                          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-white dark:bg-gray-800 border-t border-black/5 dark:border-white/5 transition-colors">
                            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                              <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-gray-400 dark:text-gray-1/40 transition-colors">Solução</p>
                                <p className="text-xs text-gray-600 dark:text-gray-1">{addon.detailed_solution || addon.description}</p>
                              </div>
                              <div className="space-y-2">
                                <p className="text-[10px] font-black uppercase text-primary/60">ROI Impact</p>
                                <p className="text-xs text-gray-600 dark:text-gray-1">{addon.roi_impact}</p>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                      </p>
                    </div>
                  ))}
                </div>
              </>
            )}
                      </p>
          </div>

          {/* STEP 3: SUMMARY */}
          <div className="lg:col-span-2 bg-gray-50 dark:bg-black/40 p-8 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col justify-between transition-colors sticky top-6">
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Resumo de Investimento</h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-500 dark:text-gray-1/60">Infraestrutura Base ({selectedTier?.name})</span>
                  <span className="text-gray-900 dark:text-white font-bold">{selectedTier?.setup_price || 0}€</span>
                </div>
                {selectedAddOns.length > 0 && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500 dark:text-gray-1/60">Add-ons ({selectedAddOns.length})</span>
                    <span className="text-gray-900 dark:text-white font-bold">
                      {addons.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.setup_price, 0)}€
                    </span>
                  </div>
                )}

                <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Setup</p>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter transition-colors">{totals.setup}</span>
                    <span className="text-xl font-bold text-gray-400 dark:text-gray-1/40 transition-colors">€</span>
                      </p>
                  </div>
                </div>
                <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1">
                  {paymentModality === 'annual' ? (
                    <>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Compromisso Anual</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter transition-colors">{totals.annualTotal?.toLocaleString('pt-PT')}</span>
                        <span className="text-xl font-bold text-gray-400 dark:text-gray-1/40 transition-colors">€/ano</span>
                      </div>
                      <p className="text-sm text-primary font-bold mt-1">
                        {totals.baseMonthly}€/mês equivalente
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Total Mensal</p>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-5xl font-bold text-gray-900 dark:text-white tracking-tighter transition-colors">{totals.monthly}</span>
                        <span className="text-xl font-bold text-gray-400 dark:text-gray-1/40 transition-colors">€/mês</span>
                      </div>
                      <p className="text-xs text-gray-400 font-bold mt-1">
                        Inclui +23% (flexibilidade mensal)
                      </p>
                    </>
                  )}
                </div>
            </div>

            <div className="mt-8">
              <button onClick={() => document.getElementById('contrato')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-5 bg-primary text-gray-900 font-black text-xl rounded-xl flex items-center justify-center space-x-3 hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                <ShieldCheckIcon className="w-6 h-6" />
                <span>CONFIRMAR PROPOSTA</span>
              </button>
              <p className="text-center text-[10px] text-gray-400 dark:text-gray-1/30 mt-4 uppercase tracking-widest transition-colors">
                Valores s/ IVA • Pagamento 50% na Confirmação
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// VARIABLE COSTS COMPONENT
// ============================================
const VariableCostsAccordion: React.FC<{ costs: VariableCost[] }> = ({ costs }) => {
  if (!costs || costs.length === 0) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight transition-colors">Custos Variáveis Externos</h2>
          <p className="text-xs text-gray-500 dark:text-gray-1/40 mt-2 max-w-md transition-colors">
            Estes valores são pagos diretamente aos fornecedores (Hosting, Domínios, APIs). A Alinhadamente configura, mas a faturação é em seu nome.
        </div>
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4 flex items-center space-x-3">
          <InformationCircleIcon className="w-5 h-5 text-primary" />
          <span className="text-[10px] text-gray-600 dark:text-gray-1/60 font-medium leading-tight transition-colors">
            Transparência Radical: <br /> Lucro Zero sobre estes serviços.
          </span>
        </div>
      </div>

      <div className="bg-white/[0.02] border border-black/5 dark:border-white/5 rounded-[2rem] overflow-hidden transition-colors">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-black/5 dark:border-white/5">
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-1/40">Serviço</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-1/40">Custo Estimado</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-1/40">Detalhe</th>
                <th className="p-6 text-xs font-bold uppercase text-gray-400 dark:text-gray-1/40 text-right">Estado</th>
              </tr>
            </thead>
            <tbody>
              {costs.map((cost) => (
                <tr key={cost.id} className="border-b border-black/5 dark:border-white/5 hover:bg-black/[0.01] dark:hover:bg-white/[0.01] transition-colors">
                  <td className="p-6">
                    <span className="font-bold text-gray-900 dark:text-white">{cost.name}</span>
                  </td>
                  <td className="p-6">
                    <span className="font-mono text-gray-600 dark:text-gray-1">~{cost.estimated_cost}€</span>
                  </td>
                  <td className="p-6">
                    <p className="text-sm text-gray-500 dark:text-gray-1/60">{cost.description}</p>
                  </td>
                  <td className="p-6 text-right">
                    {cost.required ? (
                      <span className="inline-block px-2 py-1 bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-bold uppercase rounded">Obrigatório</span>
                    ) : (
                      <span className="inline-block px-2 py-1 bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-1/50 text-[10px] font-bold uppercase rounded">Opcional</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
                      </p>
        </div>
      </div>
    </div>
  );
};

// ============================================
// FAQ SECTION COMPONENT
// ============================================
const FAQSection: React.FC<{ faqs: Faq[] }> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-8 transition-colors">Deveres & Direitos</h2>
        <p className="text-gray-600 dark:text-gray-1/60 text-lg font-light leading-relaxed transition-colors">
          Transparência radical é o nosso pilar. Como uma agência focada em Legal Tech, os nossos acordos são claros, justos e orientados à soberania digital da sua Sociedade.
        <div className="mt-12 flex items-center space-x-4">
          <div className="p-4 bg-primary/10 rounded-2xl">
            <ShieldCheckIcon className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest transition-colors">Proteção de Ativos Intelectuais</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div
            key={idx}
            className={`border-b border-black/5 dark:border-white/5 transition-all duration-300 ${openIndex === idx ? 'pb-8' : 'pb-4'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className={`text-lg font-bold transition-colors ${openIndex === idx ? 'text-primary' : 'text-gray-900 dark:text-white group-hover:text-primary dark:group-hover:text-primary'}`}>
                {faq.question}
              </span>
              <div className="ml-4 flex-shrink-0">
                {openIndex === idx ? (
                  <MinusIcon className="w-5 h-5 text-primary" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-gray-400 dark:text-gray-1/30 transition-colors" />
                )}
                      </p>
              </div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 dark:text-gray-1/60 leading-relaxed pt-2 transition-colors">
                    {faq.answer}
                </motion.div>
              )}
            </AnimatePresence>
                      </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// ADJUDICATION COMPONENT
// ============================================
const Adjudication: React.FC<{ proposalSlug: string }> = ({ proposalSlug }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAdjudicate = async () => {
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      // @ts-ignore
      if (typeof confetti !== 'undefined') {
        // @ts-ignore
        confetti({
          particleCount: 200,
          spread: 90,
          origin: { y: 0.6 },
          colors: ['#40CE2A', '#ffffff', '#1F1F1F']
        });
      }
      setIsSuccess(true);
    } catch (err) {
      console.error("Failed to adjudicate:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto py-24 px-10 bg-white/70 dark:bg-white/5 backdrop-blur rounded-[3rem] text-center border-2 border-primary overflow-hidden shadow-[0_0_100px_rgba(64,206,42,0.15)] transition-colors">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent pointer-events-none"></div>

      <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div
            key="action"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative z-10"
          >
            <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
              Aceitar Proposta e <br />Iniciar Projeto
            </h2>
            <p className="text-gray-600 dark:text-gray-1 mb-12 text-lg max-w-xl mx-auto font-light transition-colors">
              Ao confirmar a proposta, o seu gestor de conta será notificado para dar início aos procedimentos de contrato e setup.

            <button
              disabled={isSubmitting}
              onClick={handleAdjudicate}
              className={`group relative inline-flex items-center justify-center px-16 py-8 bg-primary text-gray-900 font-black text-2xl rounded-2xl transition-all duration-300 transform ${isSubmitting ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95 hover:shadow-[0_0_50px_rgba(64,206,42,0.5)]'}`}
            >
              <span className="absolute inset-0 rounded-2xl animate-ping border-4 border-primary opacity-20 pointer-events-none"></span>
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-gray-900" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  PROCESSANDO...
                </span>
              ) : (
                "CONFIRMAR PROPOSTA"
              )}
            </button>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative z-10 py-10"
          >
            <div className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
              <svg className="w-12 h-12 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
                      </p>
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Excelente escolha.</h2>
            <p className="text-gray-600 dark:text-gray-1 text-lg mb-8 max-w-lg mx-auto leading-relaxed transition-colors">
              O seu interesse foi registado com sucesso. <br />
              <span className="text-primary font-bold">Entraremos em contacto brevemente.</span>
            <div className="inline-block px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-mono text-gray-500 dark:text-gray-1/60 uppercase tracking-widest transition-colors">
              REF: {proposalSlug.toUpperCase()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
                      </p>
    </div>
  );
};

// ============================================
// MAIN APP COMPONENT
// ============================================
const AppTailwind: React.FC = () => {
  const urlSlug = useProposalSlugFromUrl();

  const slug = useMemo(() => {
    return urlSlug || import.meta.env.VITE_DEFAULT_SLUG || undefined;
  }, [urlSlug]);

  const useMockData = !slug || import.meta.env.VITE_USE_MOCK === 'true';

  // In production, show error screen if no slug is provided
  if (!slug && !import.meta.env.DEV && !import.meta.env.VITE_USE_MOCK) {
    return (
      <ErrorScreen
        error={{
          type: 'not_found',
          message: 'Nenhuma proposta especificada. Por verifique o link ou contacte geral@alinhadamente.pt'
        }}
      />
    );
  }

  const { proposal, siteConfig, loading, error } = useProposal(slug, { useMock: useMockData });

  const [currentPage, setCurrentPage] = useState<'proposal' | 'onboarding'>('proposal');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-mono text-sm animate-pulse">CARREGANDO PROPOSTA...</p>
        </div>
      </div>
    );
  }

  if (error || !proposal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <p>Erro ao carregar proposta. Por favor tente novamente.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen selection:bg-primary selection:text-gray-900 bg-gray-50 dark:bg-gray-900 transition-colors duration-300 relative">
      {currentPage === 'proposal' && (
        <motion.div className="fixed top-0 left-0 right-0 h-1 bg-primary origin-left z-[60]" style={{ scaleX }} />
      )}

      <Header currentPage={currentPage} onNavigate={setCurrentPage} />

      <AnimatePresence mode="wait">
        {currentPage === 'proposal' ? (
          <motion.main key="proposal" className="max-w-7xl mx-auto px-6 pt-32 pb-24 space-y-32">

            <section id="solucao" className="space-y-12">
              <Hero proposal={proposal} />
              <TrustBar />
            </section>

            {/* Diagnostic */}
            {proposal.diagnostic && (
              <section id="diagnostico">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Diagnóstico de Impacto</h2>
                  <p className="text-gray-600 dark:text-gray-1/60 transition-colors">Análise comparativa da infraestrutura atual vs. proposta.</p>
                      </p>
                </div>
                <DiagnosticSection diagnostic={proposal.diagnostic} />
              </section>
            )}

            {/* Roadmap */}
            {proposal.roadmap_phases && proposal.roadmap_phases.length > 0 && (
              <section id="roadmap">
                <div className="text-center mb-16">
                  <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Plano de Ação Mútuo</h2>
                  <p className="text-gray-600 dark:text-gray-1/60 transition-colors">Alinhamento de responsabilidades para garantir o sucesso do projeto.</p>
                      </p>
                </div>
                <Roadmap phases={proposal.roadmap_phases} />
              </section>
            )}

            {/* CmsMotors */}
            {proposal.motores_incluidos && proposal.motores_incluidos.length > 0 && (
              <section id="motores">
                <div className="text-center mb-16">
                  <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Arquitetura de Performance</h2>
                  <p className="text-gray-600 dark:text-gray-1 text-lg max-w-2xl mx-auto font-light transition-colors">
                    Sistemas projetados para {proposal.client.name}.
                      </p>
                </div>
                <CmsMotors motors={proposal.motores_incluidos} />
              </section>
            )}

            <section id="investimento">
              <Calculator
                proposal={proposal}
                onTotalChange={(setup, monthly, modality) => console.log(setup, monthly, modality)}
              />
            </section>

            {/* Variable Costs */}
            {proposal.variable_costs && proposal.variable_costs.length > 0 && (
              <section id="custos-variaveis">
                <VariableCostsAccordion costs={proposal.variable_costs} />
              </section>
            )}

            {/* FAQs */}
            {proposal.faqs && proposal.faqs.length > 0 && (
              <section id="direitos"><FAQSection faqs={proposal.faqs} /></section>
            )}

            <section id="contrato"><Adjudication proposalSlug={proposal.slug} /></section>
          </motion.main>
        ) : null}
      </AnimatePresence>

      <footer className="border-t border-black/5 dark:border-white/5 py-12 px-6 bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-1/50">
          <p>{siteConfig?.footer.copyright}</p>

          {proposal.team && proposal.team.length > 0 && (
            <div className="flex items-center gap-2 mt-4 md:mt-0">
              <span className="opacity-60">Proposta preparada por</span>
              <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-black/5 dark:border-white/10">
                {proposal.team[0].image_url && (
                  <img src={proposal.team[0].image_url} alt={proposal.team[0].name} className="w-5 h-5 rounded-full object-cover" />
                )}
                <span className="font-bold text-gray-900 dark:text-white">{proposal.team[0].name}</span>
                      </p>
              </div>
            </div>
          )}
                      </p>
        </div>
      </footer>
    </div>
  );
};

export default AppTailwind;
