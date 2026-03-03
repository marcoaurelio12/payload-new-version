
import React from 'react';
import { motion } from 'framer-motion';
import { PricingTier } from '../types';
import Token from './Token';
import { CheckIcon, SparklesIcon } from '@heroicons/react/24/solid';

interface PricingTiersProps {
  tiers: PricingTier[];
  selectedTierId: string | null;
  onSelectTier: (tier: PricingTier) => void;
}

const PricingTiers: React.FC<PricingTiersProps> = ({ tiers, selectedTierId, onSelectTier }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      {tiers.map((tier, idx) => {
        const isSelected = selectedTierId === tier.id;
        const isRecommended = tier.recommended;

        return (
          <motion.div
            key={tier.id}
            whileHover={{ y: -5 }}
            className={`relative p-8 rounded-3xl border transition-all duration-300 cursor-pointer flex flex-col h-full ${
              isSelected 
                ? 'bg-[#41CE2A]/10 border-[#41CE2A] shadow-[0_0_30px_rgba(65,206,42,0.15)] ring-1 ring-[#41CE2A]' 
                : 'bg-white dark:bg-white/[0.02] border-black/5 dark:border-white/5 hover:border-black/10 dark:hover:border-white/10'
            } ${isRecommended ? 'md:scale-110 z-10 bg-gradient-to-b from-white to-gray-50 dark:from-[#1F1F1F] dark:to-[#121212]' : ''}`}
            onClick={() => onSelectTier(tier)}
          >
            {isRecommended && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-[#41CE2A] text-[#1F1F1F] text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1 whitespace-nowrap">
                <SparklesIcon className="w-3 h-3" />
                Melhor Valor
              </div>
            )}

            <div className="mb-6">
              <h3 className={`text-xl font-bold mb-2 transition-colors ${isRecommended ? 'text-[#41CE2A]' : 'text-gray-900 dark:text-white'}`}>
                <Token slug={`pricing_tiers[${idx}].name`} />
              </h3>
              <div className="flex items-baseline space-x-1">
                <Token slug={`pricing_tiers[${idx}].setup_price`} suffix="€" className="text-3xl font-fluent text-gray-900 dark:text-white transition-colors" />
                <span className="text-xs text-gray-500 dark:text-[#D1D1D1]/40 uppercase font-bold transition-colors">Setup</span>
              </div>
              <div className="flex items-baseline space-x-1 mt-1">
                <Token slug={`pricing_tiers[${idx}].monthly_price`} suffix="€" className="text-lg font-mono text-gray-600 dark:text-[#D1D1D1] transition-colors" />
                <span className="text-[10px] text-gray-500 dark:text-[#D1D1D1]/40 uppercase font-bold transition-colors">/mês</span>
              </div>
            </div>

            <ul className="space-y-4 mb-8 flex-grow">
              {tier.features.map((feat, fIdx) => (
                <li key={fIdx} className="flex items-start space-x-3 text-sm text-gray-600 dark:text-[#D1D1D1]/80 transition-colors">
                  <div className={`p-0.5 rounded-full ${isSelected ? 'bg-[#41CE2A]' : 'bg-black/10 dark:bg-white/10'}`}>
                    <CheckIcon className={`w-3 h-3 ${isSelected ? 'text-[#1F1F1F]' : 'text-gray-500 dark:text-[#D1D1D1]/50'}`} />
                  </div>
                  <span><Token slug={`pricing_tiers[${idx}].features[${fIdx}]`} /></span>
                </li>
              ))}
            </ul>

            <button className={`w-full py-4 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${
              isSelected 
                ? 'bg-[#41CE2A] text-[#1F1F1F] shadow-lg' 
                : isRecommended 
                  ? 'bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white hover:bg-[#41CE2A] hover:text-[#1F1F1F]' 
                  : 'bg-black/5 dark:bg-white/5 text-gray-900 dark:text-white hover:bg-black/10 dark:hover:bg-white/10'
            }`}>
              {isSelected ? 'Selecionado' : 'Selecionar'}
            </button>
          </motion.div>
        );
      })}
    </div>
  );
};

export default PricingTiers;
