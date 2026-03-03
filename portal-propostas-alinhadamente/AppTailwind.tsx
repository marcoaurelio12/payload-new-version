import React, { useState, useEffect, useMemo, lazy, Suspense } from 'react';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import {
  SunIcon,
  MoonIcon,
  CodeBracketIcon,
  ShieldCheckIcon,
  CloudIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';
import { useProposalSlugFromUrl } from './hooks/useProposal';
import { useProposalAuth } from './hooks/useProposalAuth';
import AuthScreen from './components/AuthScreen';
import ErrorScreen from './components/ErrorScreen';
import Logo from './components/Logo';

// ============================================
// LAZY LOADED COMPONENTS (Below the fold)
// ============================================
const Calculator = lazy(() => import('./components/Calculator'));
const Adjudication = lazy(() => import('./components/Adjudication'));
const CmsMotors = lazy(() => import('./components/CmsMotors'));
const Roadmap = lazy(() => import('./components/Roadmap'));
const FAQSection = lazy(() => import('./components/FAQSection'));
const VariableCostsAccordion = lazy(() => import('./components/VariableCostsAccordion'));

// ============================================
// LOADING FALLBACK
// ============================================
const SectionLoader: React.FC = () => (
  <div className="min-h-[200px] flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
  </div>
);

// ============================================
// TYPES (Keep minimal for inline components)
// ============================================
interface Diagnostic {
  problemLabel?: string;
  solutionLabel?: string;
  problem: string;
  solution: string;
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
  diagnostic?: Diagnostic;
  roadmap_phases?: Array<{
    phase: string | number;
    title: string;
    duration: string;
    agency_tasks: string[];
    client_tasks: string[];
  }>;
  motores_incluidos?: Array<{
    id: string;
    title: string;
    description: string;
    icon: string;
    features?: { feature_text: string }[];
  }>;
  pricing: {
    setupPrice: number;
    monthlyBase: number;
    tiers?: Array<{
      id: string;
      name: string;
      setup_price: number;
      monthly_price: number;
      features: string[];
      recommended?: boolean;
    }>;
  };
  addons_disponiveis?: Array<{
    id: string;
    name: string;
    description: string;
    setup_price: number;
    monthly_price: number;
  }>;
  variable_costs?: Array<{
    id: string;
    name: string;
    estimated_cost: string | number;
    description: string;
    required: boolean;
  }>;
  faqs?: Array<{
    question: string;
    answer: string;
  }>;
  team?: Array<{
    name: string;
    image_url?: string;
  }>;
}

// ============================================
// HEADER COMPONENT (Keep inline - above fold)
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
            <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Válida</span>
          </div>
        </div>
      </div>
    </header>
  );
};

// ============================================
// HERO COMPONENT (Keep inline - above fold)
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
          </p>
        )}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button
            onClick={() => document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-primary text-gray-900 font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform"
          >
            Explorar Solução
          </button>
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
              loading="lazy"
              width="800"
              height="450"
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
    </div>
  );
};

// ============================================
// TRUST BAR COMPONENT (Keep inline - above fold)
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
// DIAGNOSTIC SECTION COMPONENT (Keep inline)
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
          </p>
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
          </p>
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
// MAIN APP COMPONENT
// ============================================
const AppTailwind: React.FC = () => {
  const urlSlug = useProposalSlugFromUrl();

  const slug = useMemo(() => {
    // Only use default slug in development mode
    if (import.meta.env.DEV && import.meta.env.VITE_DEFAULT_SLUG) {
      return urlSlug || import.meta.env.VITE_DEFAULT_SLUG;
    }
    // In production, only use URL slug
    return urlSlug || undefined;
  }, [urlSlug]);

  // Auth flow - required for all proposals
  const { phase, proposalPreview, proposal, siteConfig, accessPass, error: authError, verifyCode, reset } = useProposalAuth(slug || '');

  const [currentPage, setCurrentPage] = useState<'proposal' | 'onboarding'>('proposal');

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  // No slug provided
  if (!slug) {
    return (
      <ErrorScreen
        error={{
          type: 'not_found',
          message: 'Nenhuma proposta especificada. Por favor, use um link válido.'
        }}
      />
    );
  }

  // Checking if proposal exists
  if (phase === 'checking') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="text-primary font-mono text-sm animate-pulse">A VERIFICAR PROPOSTA...</p>
        </div>
      </div>
    );
  }

  // Login screen - proposal exists, need to enter access code
  if ((phase === 'login' || phase === 'verifying') && proposalPreview) {
    return (
      <AuthScreen
        proposalPreview={proposalPreview}
        isVerifying={phase === 'verifying'}
        error={authError}
        onVerify={verifyCode}
      />
    );
  }

  // Error screen - proposal not found, expired, or other errors
  if (phase === 'error' && authError) {
    return (
      <ErrorScreen
        error={authError}
        onRetry={authError.type === 'network' ? reset : undefined}
      />
    );
  }

  // Authenticated - show proposal
  if (phase === 'authenticated' && proposal && siteConfig) {
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
                <Hero proposal={proposal as any} />
                <TrustBar />
              </section>

              {/* Diagnostic */}
              {proposal.diagnostic && (
                <section id="diagnostico">
                  <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Diagnóstico de Impacto</h2>
                    <p className="text-gray-600 dark:text-gray-1/60 transition-colors">Análise comparativa da infraestrutura atual vs. proposta.</p>
                  </div>
                  <DiagnosticSection diagnostic={proposal.diagnostic as any} />
                </section>
              )}

              {/* Roadmap - Lazy Loaded */}
              {proposal.roadmap_phases && proposal.roadmap_phases.length > 0 && (
                <section id="roadmap">
                  <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">Plano de Ação Mútuo</h2>
                    <p className="text-gray-600 dark:text-gray-1/60 transition-colors">Alinhamento de responsabilidades para garantir o sucesso do projeto.</p>
                  </div>
                  <Suspense fallback={<SectionLoader />}>
                    <Roadmap phases={proposal.roadmap_phases as any} />
                  </Suspense>
                </section>
              )}

              {/* CmsMotors - Lazy Loaded */}
              {proposal.motores_incluidos && proposal.motores_incluidos.length > 0 && (
                <section id="motores">
                  <div className="text-center mb-16">
                    <h2 className="text-5xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Arquitetura de Performance</h2>
                    <p className="text-gray-600 dark:text-gray-1 text-lg max-w-2xl mx-auto font-light transition-colors">
                      Sistemas projetados para {proposal.client.name}.
                    </p>
                  </div>
                  <Suspense fallback={<SectionLoader />}>
                    <CmsMotors motors={proposal.motores_incluidos as any} />
                  </Suspense>
                </section>
              )}

              {/* Calculator - Lazy Loaded */}
              <section id="investimento">
                <Suspense fallback={<SectionLoader />}>
                  <Calculator
                    proposal={proposal as any}
                    onTotalChange={() => { /* tracked internally */ }}
                  />
                </Suspense>
              </section>

              {/* Variable Costs - Lazy Loaded */}
              {proposal.variable_costs && proposal.variable_costs.length > 0 && (
                <section id="custos-variaveis">
                  <Suspense fallback={<SectionLoader />}>
                    <VariableCostsAccordion costs={proposal.variable_costs as any} />
                  </Suspense>
                </section>
              )}

              {/* FAQs - Lazy Loaded */}
              {proposal.faqs && proposal.faqs.length > 0 && (
                <section id="direitos">
                  <Suspense fallback={<SectionLoader />}>
                    <FAQSection faqs={proposal.faqs as any} />
                  </Suspense>
                </section>
              )}

              {/* Adjudication - Lazy Loaded */}
              <section id="contrato">
                <Suspense fallback={<SectionLoader />}>
                  <Adjudication proposalSlug={proposal.slug} accessPass={accessPass || undefined} />
                </Suspense>
              </section>
            </motion.main>
          ) : null}
        </AnimatePresence>

        <footer className="border-t border-black/5 dark:border-white/5 py-12 px-6 bg-gray-100 dark:bg-gray-900 transition-colors">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center text-sm text-gray-500 dark:text-gray-1/50">
            <p>{siteConfig.footer.copyright}</p>

            {proposal.team && proposal.team.length > 0 && (
              <div className="flex items-center gap-2 mt-4 md:mt-0">
                <span className="opacity-60">Proposta preparada por</span>
                <div className="flex items-center gap-2 bg-white dark:bg-white/5 px-3 py-1 rounded-full border border-black/5 dark:border-white/10">
                  {proposal.team[0].image_url && (
                    <img
                      src={proposal.team[0].image_url}
                      alt={proposal.team[0].name}
                      className="w-5 h-5 rounded-full object-cover"
                      loading="lazy"
                      width="20"
                      height="20"
                    />
                  )}
                  <span className="font-bold text-gray-900 dark:text-white">{proposal.team[0].name}</span>
                </div>
              </div>
            )}
          </div>
        </footer>
      </div>
    );
  }

  // Fallback - should not reach here
  return (
    <ErrorScreen
      error={{
        type: 'unknown',
        message: 'Ocorreu um erro inesperado. Por favor, tente novamente.'
      }}
      onRetry={reset}
    />
  );
};

export default AppTailwind;
