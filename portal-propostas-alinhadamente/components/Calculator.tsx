
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircleIcon, 
  ClockIcon, 
  ArrowTrendingUpIcon,
  SparklesIcon,
  CheckIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/solid';
import { Proposal, PricingTier } from '../types';

interface CalculatorProps {
  proposal: Proposal;
  onTotalChange: (setup: number, monthly: number) => void;
}

const Calculator: React.FC<CalculatorProps> = ({ proposal, onTotalChange }) => {
  // Find recommended tier or default to first
  const defaultTier = proposal.pricing.tiers?.find(t => t.recommended) || proposal.pricing.tiers?.[0];
  
  const [selectedTier, setSelectedTier] = useState<PricingTier | null>(defaultTier || null);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [expandedAddOnId, setExpandedAddOnId] = useState<string | null>(null);

  const tiers = proposal.pricing.tiers || [];
  const addons = proposal.addons_disponiveis || [];

  // Calculate Totals
  const calculateTotals = () => {
    let setup = 0;
    let monthly = 0;

    if (selectedTier) {
      setup += selectedTier.setup_price;
      monthly += selectedTier.monthly_price;
    } else {
      setup += proposal.pricing.setupPrice;
      monthly += proposal.pricing.monthlyBase;
    }

    const selectedAddonData = addons.filter(a => selectedAddOns.includes(a.id));
    setup += selectedAddonData.reduce((sum, a) => sum + a.setup_price, 0);
    monthly += selectedAddonData.reduce((sum, a) => sum + a.monthly_price, 0);

    return { setup, monthly };
  };

  const totals = calculateTotals();

  // Notify parent of total changes (for sticky footer etc)
  useEffect(() => {
    onTotalChange(totals.setup, totals.monthly);
  }, [totals.setup, totals.monthly]);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  // Calculate Real-time ROI Impact
  const roiStats = addons
    .filter(a => selectedAddOns.includes(a.id))
    .reduce((acc, curr) => ({
      hoursSaved: acc.hoursSaved + (curr.hours_saved || 0),
      retentionBoost: acc.retentionBoost + (curr.retention_boost || 0)
    }), { hoursSaved: 0, retentionBoost: 0 });

  return (
    <div className="bg-white dark:bg-[#181818] rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 shadow-2xl relative transition-colors duration-300">
      <div className="p-8 lg:p-12">
        <h2 className="text-4xl font-fluent text-gray-900 dark:text-white mb-2 tracking-tight transition-colors">Investimento</h2>
        <p className="text-gray-600 dark:text-[#D1D1D1]/60 mb-10 transition-colors">Configure o nível de serviço e os extras da sua infraestrutura.</p>

        {/* STEP 1: TIERS */}
        {tiers.length > 0 && (
          <div className="mb-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-[#41CE2A] mb-6">1. Escolha o Nível Base</h3>
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
                        ? 'border-[#41CE2A] bg-[#41CE2A]/5 z-10 ring-1 ring-[#41CE2A]' 
                        : 'border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] hover:border-black/10'
                    }`}
                    whileHover={{ scale: 1.02 }}
                  >
                    {tier.recommended && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#41CE2A] text-[#1F1F1F] text-[10px] font-black uppercase px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                        <SparklesIcon className="w-3 h-3" />
                        Recomendado
                      </div>
                    )}
                    
                    <div className="flex justify-between items-start mb-6">
                      <h4 className={`text-xl font-bold transition-colors ${isSelected ? 'text-[#41CE2A]' : 'text-gray-900 dark:text-white'}`}>
                        {tier.name}
                      </h4>
                      {isSelected ? (
                        <CheckCircleIcon className="w-6 h-6 text-[#41CE2A]" />
                      ) : (
                        <div className="w-6 h-6 rounded-full border border-gray-300 dark:border-white/20"></div>
                      )}
                    </div>
                    
                    <div className="mb-6 pb-6 border-b border-black/5 dark:border-white/5">
                      <p className="text-3xl font-fluent text-gray-900 dark:text-white mb-1">
                        {tier.setup_price}€ <span className="text-xs text-gray-400 font-bold uppercase">Setup</span>
                      </p>
                      <p className="text-lg text-gray-500 dark:text-[#D1D1D1]/60">
                        {tier.monthly_price}€ <span className="text-[10px] uppercase font-bold">/mês</span>
                      </p>
                    </div>

                    {/* Features List - Always Visible */}
                    <div className="flex-grow">
                      <p className="text-[10px] font-bold text-gray-400 dark:text-white/40 uppercase tracking-widest mb-4">
                        O que inclui:
                      </p>
                      <ul className="space-y-3 mb-6">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <CheckIcon className={`w-4 h-4 flex-shrink-0 mt-0.5 ${isSelected ? 'text-[#41CE2A]' : 'text-gray-400'}`} />
                            <span className="text-sm text-gray-700 dark:text-[#D1D1D1] leading-tight">{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-colors ${
                      isSelected 
                        ? 'bg-[#41CE2A] text-[#1F1F1F]' 
                        : 'bg-black/5 dark:bg-white/5 text-gray-500 dark:text-white/50 group-hover:bg-black/10'
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
                    <h3 className="text-sm font-bold uppercase tracking-widest text-[#41CE2A] mb-4">2. Adicione Capacidades</h3>
                    
                    {/* ROI Dashboard */}
                    <AnimatePresence>
                    {selectedAddOns.length > 0 && (
                        <motion.div 
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="grid grid-cols-2 gap-4 mb-6 overflow-hidden"
                        >
                        <div className="bg-[#41CE2A]/10 border border-[#41CE2A]/20 p-4 rounded-xl flex items-center space-x-3">
                            <ClockIcon className="w-8 h-8 text-[#41CE2A] flex-shrink-0" />
                            <div>
                            <p className="text-[10px] text-[#41CE2A] font-black uppercase tracking-wider">Tempo Poupado</p>
                            <p className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{roiStats.hoursSaved}h<span className="text-xs text-gray-500 dark:text-white/50">/mês</span></p>
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
                            <div key={addon.id} className={`group rounded-2xl border-2 transition-all duration-300 overflow-hidden ${selectedAddOns.includes(addon.id) ? 'border-[#41CE2A] bg-[#41CE2A]/5' : 'border-black/5 dark:border-white/5 bg-black/5 dark:bg-white/5'}`}>
                                <div onClick={() => toggleAddOn(addon.id)} className="p-6 flex items-center justify-between cursor-pointer">
                                    <div className="flex items-center space-x-5">
                                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all ${selectedAddOns.includes(addon.id) ? 'bg-[#41CE2A]' : 'bg-black/10 dark:bg-white/10'}`}>
                                            {selectedAddOns.includes(addon.id) && <CheckCircleIcon className="w-5 h-5 text-[#1F1F1F]" />}
                                        </div>
                                        <div>
                                            <div className="flex items-center space-x-2">
                                                <h4 className="font-bold text-gray-900 dark:text-white text-lg tracking-tight transition-colors">{addon.name}</h4>
                                                {selectedAddOns.includes(addon.id) && <span className="text-[8px] bg-[#41CE2A] text-[#1F1F1F] px-1.5 py-0.5 rounded font-bold uppercase">Ativo</span>}
                                            </div>
                                            <button onClick={(e) => { e.stopPropagation(); setExpandedAddOnId(expandedAddOnId === addon.id ? null : addon.id); }} className="text-[10px] text-[#41CE2A] font-bold uppercase tracking-widest mt-1 hover:underline">Ver mais</button>
                                        </div>
                                    </div>
                                    <div className="text-right flex flex-col items-end">
                                        <span className="font-bold text-gray-900 dark:text-white">{addon.setup_price}€</span>
                                        <span className="text-[10px] opacity-40 text-gray-900 dark:text-white whitespace-nowrap">{addon.monthly_price > 0 ? `+${addon.monthly_price}€/mês` : 'Incluído'}</span>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {expandedAddOnId === addon.id && (
                                    <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="bg-white dark:bg-[#181818] border-t border-black/5 dark:border-white/5 transition-colors">
                                        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase text-gray-400 dark:text-[#D1D1D1]/40 transition-colors">Solução</p>
                                                <div className="text-xs text-gray-600 dark:text-[#D1D1D1]" dangerouslySetInnerHTML={{ __html: addon.detailed_solution || addon.description || '' }} />
                                            </div>
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase text-[#41CE2A]/60">ROI Impact</p>
                                                <div className="text-xs text-gray-600 dark:text-[#D1D1D1]" dangerouslySetInnerHTML={{ __html: addon.roi_impact || '' }} />
                                            </div>
                                            {addon.third_party_costs && (
                                            <div className="space-y-2">
                                                <p className="text-[10px] font-black uppercase text-amber-500/80">Custos de Terceiros</p>
                                                <div className="text-xs text-gray-600 dark:text-[#D1D1D1]" dangerouslySetInnerHTML={{ __html: addon.third_party_costs }} />
                                            </div>
                                            )}
                                        </div>
                                    </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                    </>
                )}
            </div>

            {/* STEP 3: SUMMARY */}
            <div className="lg:col-span-2 bg-gray-50 dark:bg-black/40 p-8 rounded-2xl border border-black/5 dark:border-white/5 flex flex-col justify-between transition-colors sticky top-6">
                <div className="space-y-8">
                    <h3 className="text-xl font-fluent text-gray-900 dark:text-white tracking-tight transition-colors">Resumo de Investimento</h3>
                    
                    <div className="space-y-4">
                        <div className="flex justify-between items-center text-sm">
                             <span className="text-gray-500 dark:text-[#D1D1D1]/60">Infraestrutura Base ({selectedTier?.name})</span>
                             <span className="text-gray-900 dark:text-white font-bold">{selectedTier?.setup_price || 0}€</span>
                        </div>
                         {selectedAddOns.length > 0 && (
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-gray-500 dark:text-[#D1D1D1]/60">Add-ons ({selectedAddOns.length})</span>
                                <span className="text-gray-900 dark:text-white font-bold">
                                    {addons.filter(a => selectedAddOns.includes(a.id)).reduce((sum, a) => sum + a.setup_price, 0)}€
                                </span>
                            </div>
                         )}

                        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1">
                             <p className="text-[10px] font-black text-[#41CE2A] uppercase tracking-[0.2em]">Total Setup</p>
                             <div className="flex items-baseline space-x-2">
                                <span className="text-5xl font-fluent text-gray-900 dark:text-white tracking-tighter transition-colors">{totals.setup}</span>
                                <span className="text-xl font-bold text-gray-400 dark:text-[#D1D1D1]/40 transition-colors">€</span>
                             </div>
                        </div>

                        <div className="pt-4 border-t border-black/5 dark:border-white/5 space-y-1">
                             <p className="text-[10px] font-black text-[#41CE2A] uppercase tracking-[0.2em]">Total Mensal</p>
                             <div className="flex items-baseline space-x-2">
                                <span className="text-5xl font-fluent text-gray-900 dark:text-white tracking-tighter transition-colors">{totals.monthly}</span>
                                <span className="text-xl font-bold text-gray-400 dark:text-[#D1D1D1]/40 transition-colors">€</span>
                             </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8">
                    <button onClick={() => document.getElementById('contrato')?.scrollIntoView({ behavior: 'smooth' })} className="w-full py-4 px-6 bg-[#41CE2A] text-[#1F1F1F] font-black text-base sm:text-xl rounded-xl flex items-center justify-center hover:scale-105 transition-transform shadow-lg shadow-[#41CE2A]/20">
                        CONFIRMAR PROPOSTA
                    </button>
                    <p className="text-center text-[10px] text-gray-400 dark:text-[#D1D1D1]/30 mt-4 uppercase tracking-widest transition-colors">
                        Valores s/ IVA • Pagamento 50% na Confirmação
                    </p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Calculator;
