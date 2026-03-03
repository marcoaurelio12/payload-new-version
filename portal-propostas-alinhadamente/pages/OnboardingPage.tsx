
import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowRightIcon, 
  ArrowLeftIcon, 
  CloudArrowUpIcon, 
  CheckCircleIcon,
  SparklesIcon,
  SwatchIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

interface OnboardingPageProps {
  onComplete: () => void;
}

interface SubmissionData {
  companyName: string;
  logo: File | null;
  stylePreference: string;
  primaryNiche: string;
  integrations: string[];
}

const OnboardingPage: React.FC<OnboardingPageProps> = ({ onComplete }) => {
  const [step, setStep] = useState(0);
  const [data, setData] = useState<SubmissionData>({
    companyName: '',
    logo: null,
    stylePreference: '',
    primaryNiche: '',
    integrations: []
  });
  const [isSyncing, setIsSyncing] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  
  // Accessibility: Focus management
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // Move focus to the heading of the new step for screen readers
    headingRef.current?.focus();
  }, [step]);

  // Mock PATCH request to Payload CMS
  const syncToPayload = async (field: string, value: any) => {
    setIsSyncing(true);
    console.log(`[Payload CMS PATCH] Syncing ${field}:`, value);
    // Simulate API latency
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsSyncing(false);
  };

  const updateField = (field: keyof SubmissionData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
    syncToPayload(field, value);
  };

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  // Conditional Logic: Skip style preference if logo is provided
  const steps = useMemo(() => [
    {
      id: 'name',
      label: 'Qual o nome oficial da Sociedade?',
      type: 'text',
      component: (
        <div className="space-y-4">
          <label htmlFor="company-name-input" className="sr-only">Nome da Sociedade</label>
          <input
            id="company-name-input"
            autoFocus
            type="text"
            placeholder="Ex: Vieira de Almeida"
            className="w-full bg-white dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 rounded-2xl p-6 text-2xl text-gray-900 dark:text-white focus:border-[#41CE2A] dark:focus:border-[#41CE2A] outline-none transition-all placeholder:text-gray-400 dark:placeholder:text-white/40"
            value={data.companyName}
            onChange={(e) => setData(prev => ({ ...prev, companyName: e.target.value }))}
            onBlur={() => syncToPayload('companyName', data.companyName)}
            aria-labelledby="step-heading"
          />
          <p className="text-sm text-gray-500 dark:text-[#D1D1D1]/70" id="name-hint">Este nome será utilizado nos metadados de SEO e contratos.</p>
        </div>
      )
    },
    {
      id: 'logo',
      label: 'Possui um Logótipo pronto para upload?',
      type: 'file',
      component: (
        <div className="space-y-6">
          <div 
            role="button"
            tabIndex={0}
            aria-label="Carregar logótipo. Clique ou pressione Enter para selecionar um ficheiro."
            className={`border-2 border-dashed rounded-3xl p-12 text-center transition-all cursor-pointer group focus:outline-none focus:ring-2 focus:ring-[#41CE2A] ${data.logo ? 'border-[#41CE2A] bg-[#41CE2A]/5' : 'border-gray-300 dark:border-white/10 hover:border-gray-400 dark:hover:border-white/20'}`}
            onClick={() => document.getElementById('logo-upload')?.click()}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                document.getElementById('logo-upload')?.click();
              }
            }}
          >
            <input 
              id="logo-upload"
              type="file" 
              className="hidden" 
              accept="image/*"
              tabIndex={-1}
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  if (file.size > 10 * 1024 * 1024) {
                    alert("Limite de 10MB excedido.");
                    return;
                  }
                  updateField('logo', file);
                }
              }}
            />
            {data.logo ? (
              <div className="flex flex-col items-center">
                <CheckCircleIcon className="w-16 h-16 text-[#41CE2A] mb-4" />
                <p className="text-gray-900 dark:text-white font-bold">{data.logo.name}</p>
                <p className="text-xs text-[#41CE2A] mt-2 font-bold uppercase tracking-widest">Upload Concluído</p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <CloudArrowUpIcon className="w-16 h-16 text-gray-400 dark:text-[#D1D1D1]/60 group-hover:text-[#41CE2A] transition-colors mb-4" />
                <p className="text-lg text-gray-900 dark:text-white font-medium">Arraste ou clique para selecionar</p>
                <p className="text-xs text-gray-500 dark:text-[#D1D1D1]/60 mt-2">Formatos: SVG, PNG, WebP (Máx 10MB)</p>
              </div>
            )}
          </div>
          {!data.logo && (
            <button 
              onClick={() => nextStep()} 
              className="w-full text-center text-xs font-bold text-gray-500 dark:text-[#D1D1D1]/60 hover:text-[#41CE2A] uppercase tracking-widest transition-colors focus:outline-none focus:text-[#41CE2A]"
            >
              Não tenho logótipo, prefiro definir estilo visual
            </button>
          )}
        </div>
      )
    },
    {
      id: 'style',
      label: 'Que estética visual melhor representa a sua marca?',
      type: 'choice',
      skip: !!data.logo,
      component: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" role="radiogroup" aria-labelledby="step-heading">
          {[
            { id: 'corporate', label: 'Corporativo & Sóbrio', desc: 'Foco em confiança e tradição.' },
            { id: 'modern', label: 'Minimalismo Digital', desc: 'Foco em inovação e agilidade.' },
            { id: 'luxury', label: 'Luxo Contemporâneo', desc: 'Foco em exclusividade e detalhe.' },
            { id: 'bold', label: 'Impacto & Força', desc: 'Foco em autoridade e presença.' }
          ].map(style => (
            <button
              key={style.id}
              role="radio"
              aria-checked={data.stylePreference === style.id}
              onClick={() => {
                updateField('stylePreference', style.id);
                nextStep();
              }}
              className={`p-6 text-left rounded-2xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-[#41CE2A] ${data.stylePreference === style.id ? 'border-[#41CE2A] bg-[#41CE2A]/10' : 'border-gray-200 dark:border-white/5 bg-white dark:bg-white/5 hover:border-gray-300 dark:hover:border-white/20'}`}
            >
              <h4 className="text-gray-900 dark:text-white font-bold mb-1">{style.label}</h4>
              <p className="text-xs text-gray-500 dark:text-[#D1D1D1]/60">{style.desc}</p>
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'niche',
      label: 'Qual o Nicho de Prática Principal?',
      type: 'choice',
      component: (
        <div className="grid grid-cols-2 gap-4" role="radiogroup" aria-labelledby="step-heading">
          {['Corporate', 'Lutigue', 'Real Estate', 'Tech/IP', 'Financeiro', 'Fiscal'].map(n => (
            <button
              key={n}
              role="radio"
              aria-checked={data.primaryNiche === n}
              onClick={() => {
                updateField('primaryNiche', n);
                nextStep();
              }}
              className={`p-4 rounded-xl border-2 text-sm font-bold transition-all focus:outline-none focus:ring-2 focus:ring-[#41CE2A] ${data.primaryNiche === n ? 'border-[#41CE2A] bg-[#41CE2A]/10 text-[#41CE2A]' : 'border-gray-200 dark:border-white/5 text-gray-500 dark:text-[#D1D1D1]/60 bg-white dark:bg-transparent'}`}
            >
              {n}
            </button>
          ))}
        </div>
      )
    },
    {
      id: 'confirm',
      label: 'Confirmar Identidade de Marca',
      type: 'final',
      component: (
        <div className="space-y-8">
          <div className="p-8 glass-card rounded-[2rem] border-2 border-[#41CE2A]/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <SparklesIcon className="w-8 h-8 text-[#41CE2A]/20" />
            </div>
            
            <div className="flex items-center space-x-6 mb-8">
              {data.logo ? (
                <div className="w-20 h-20 rounded-xl bg-gray-50 dark:bg-white/5 flex items-center justify-center p-4">
                  <img src={URL.createObjectURL(data.logo)} className="max-w-full max-h-full object-contain" alt="Logo preview" />
                </div>
              ) : (
                <div className="w-20 h-20 rounded-xl bg-[#41CE2A]/10 flex items-center justify-center">
                  <SwatchIcon className="w-10 h-10 text-[#41CE2A]" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-fluent text-gray-900 dark:text-white">{data.companyName || 'Sua Sociedade'}</h3>
                <p className="text-xs text-[#41CE2A] font-black uppercase tracking-widest">{data.primaryNiche || 'Especialista'}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                <p className="text-[10px] text-gray-500 dark:text-[#D1D1D1]/60 uppercase font-bold mb-2">Paleta Core</p>
                <div className="flex space-x-2">
                  <div className="w-6 h-6 rounded-full bg-[#1F1F1F] border border-white/20" aria-label="Dark Grey"></div>
                  <div className="w-6 h-6 rounded-full bg-[#41CE2A]" aria-label="Neon Green"></div>
                  <div className="w-6 h-6 rounded-full bg-[#D1D1D1]" aria-label="Silver"></div>
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-xl border border-gray-200 dark:border-white/5">
                <p className="text-[10px] text-gray-500 dark:text-[#D1D1D1]/60 uppercase font-bold mb-2">Estilo</p>
                <p className="text-xs text-gray-900 dark:text-white font-bold capitalize">{data.stylePreference || 'Visual ID do Logo'}</p>
              </div>
            </div>
          </div>
          
          <button
            onClick={async () => {
              setIsFinalizing(true);
              console.log("[n8n Trigger] Submission completed...");
              await new Promise(resolve => setTimeout(resolve, 2500));
              
              // @ts-ignore
              confetti({
                particleCount: 150,
                spread: 100,
                colors: ['#41CE2A', '#ffffff'],
                origin: { y: 0.8 }
              });
              
              setIsFinalizing(false);
              onComplete();
            }}
            disabled={isFinalizing}
            className="w-full py-6 bg-[#41CE2A] text-[#1F1F1F] font-black text-xl rounded-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 focus:outline-none focus:ring-4 focus:ring-[#41CE2A]/50"
          >
            {isFinalizing ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-6 w-6 text-[#1F1F1F]" viewBox="0 0 24 24" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>A PROCESSAR BRIEFING...</span>
              </span>
            ) : (
              <>
                <ShieldCheckIcon className="w-6 h-6" />
                <span>FINALIZAR ONBOARDING</span>
              </>
            )}
          </button>
        </div>
      )
    }
  ], [data]);

  // Filter out skipped steps
  const activeSteps = useMemo(() => steps.filter(s => !s.skip), [steps]);
  const currentStepData = activeSteps[step];

  return (
    <div className="max-w-2xl mx-auto px-6 py-12 min-h-[60vh] flex flex-col">
      {/* Progress Header */}
      <div className="mb-12 flex items-center justify-between" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={activeSteps.length} aria-label="Progresso do Onboarding">
        <div className="flex items-center space-x-2">
          {activeSteps.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 transition-all duration-500 rounded-full ${idx <= step ? 'w-12 bg-[#41CE2A]' : 'w-4 bg-gray-200 dark:bg-white/10'}`}
              aria-hidden="true"
            />
          ))}
        </div>
        <div className="flex items-center space-x-2">
          {isSyncing && (
             <motion.div 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }} 
               className="flex items-center space-x-2 text-[10px] font-bold text-[#41CE2A] uppercase tracking-widest"
               role="status"
               aria-live="polite"
             >
               <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#41CE2A] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#41CE2A]"></span>
               </span>
               <span>Payload Sync</span>
             </motion.div>
          )}
          <span className="text-[10px] font-bold text-gray-400 dark:text-[#D1D1D1]/60 uppercase tracking-[0.2em]">Passo {step + 1} de {activeSteps.length}</span>
        </div>
      </div>

      {/* Main Form Content */}
      <div className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepData.id}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="space-y-8"
          >
            <h2 
              id="step-heading"
              ref={headingRef}
              tabIndex={-1}
              className="text-3xl lg:text-5xl font-fluent text-gray-900 dark:text-white tracking-tight leading-tight outline-none"
            >
              {currentStepData.label}
            </h2>
            
            <div className="py-4">
              {currentStepData.component}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer Navigation */}
      <div className="mt-12 flex items-center justify-between">
        <button
          onClick={prevStep}
          disabled={step === 0 || isFinalizing}
          className={`flex items-center space-x-2 text-xs font-bold uppercase tracking-widest transition-colors focus:outline-none focus:text-gray-900 dark:focus:text-white ${step === 0 ? 'opacity-0' : 'text-gray-400 dark:text-[#D1D1D1]/60 hover:text-gray-900 dark:hover:text-white'}`}
          aria-label="Passo Anterior"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span>Anterior</span>
        </button>

        {step < activeSteps.length - 1 && (
          <button
            onClick={nextStep}
            disabled={
              (currentStepData.id === 'name' && !data.companyName) ||
              (currentStepData.id === 'logo' && !data.logo) ||
              isFinalizing
            }
            className={`flex items-center space-x-2 px-8 py-4 bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all focus:outline-none focus:ring-2 focus:ring-[#41CE2A] ${
              ((currentStepData.id === 'name' && data.companyName) || (currentStepData.id === 'logo' && data.logo))
              ? 'bg-[#41CE2A]/10 border-[#41CE2A] text-[#41CE2A] hover:bg-[#41CE2A]/20'
              : 'opacity-50 grayscale text-gray-400 dark:text-gray-500'
            }`}
            aria-label="Próximo Passo"
          >
            <span>Seguinte</span>
            <ArrowRightIcon className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="mt-12 p-6 glass-card rounded-2xl border-dashed border-gray-300 dark:border-white/10">
        <p className="text-[10px] text-gray-500 dark:text-[#D1D1D1]/60 leading-relaxed font-medium uppercase tracking-[0.1em]">
          Nota de Conformidade: Todos os dados inseridos são encriptados via SSL e armazenados em infraestrutura gerida pela Alinhadamente. O seu briefing inicial gerará automaticamente um rascunho de copywriting via LLM integrado.
        </p>
      </div>
    </div>
  );
};

export default OnboardingPage;
