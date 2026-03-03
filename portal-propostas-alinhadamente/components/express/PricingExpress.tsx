
import React, { useState } from 'react';
import { SparklesIcon, CheckIcon } from '@heroicons/react/24/solid';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Proposal, PricingTier, AddOn } from '../../types';
import Token from '../Token';
import { motion, AnimatePresence } from 'framer-motion';

interface PricingExpressProps {
  proposal: Proposal;
  selectedTier: PricingTier;
  onSelectTier: (tier: PricingTier) => void;
  selectedAddOns: string[];
  onToggleAddOn: (id: string) => void;
  totalMonthly: number;
  totalSetup: number;
}

const PricingExpress: React.FC<PricingExpressProps> = ({ 
  proposal, selectedTier, onSelectTier, selectedAddOns, onToggleAddOn, totalMonthly, totalSetup 
}) => {
  const [expandedAddonId, setExpandedAddonId] = useState<string | null>(null);

  return (
    <section id="pricing-express" className="py-12 px-5 bg-white">
      <h2 className="text-h2-mobile md:text-h2 text-brand-black font-bold text-center mb-10">Investimento</h2>
      
      {/* Recommended Tier Card */}
      <div className="max-w-lg mx-auto bg-gradient-to-br from-white to-primary/5 border-2 border-primary rounded-2xl p-6 md:p-8 shadow-xl shadow-primary/10 relative mb-6">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-primary text-white rounded-full text-sm font-bold shadow-lg shadow-primary/30 flex items-center gap-1.5 whitespace-nowrap">
          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }}>
            <SparklesIcon className="w-4 h-4 text-white" />
          </motion.div>
          Recomendado
        </div>

        <h3 className="text-subheader-1 font-bold text-brand-black text-center mb-6 mt-2">{selectedTier.name}</h3>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-gray-1 rounded-xl p-4 text-center">
            <p className="text-xs text-gray-3 mb-1 uppercase tracking-wide">Setup Único</p>
            <p className="text-subheader-2 font-bold text-brand-black">{selectedTier.setup_price}€</p>
          </div>
          <div className="bg-white border border-gray-1 rounded-xl p-4 text-center">
             <p className="text-xs text-gray-3 mb-1 uppercase tracking-wide">Mensal</p>
             <p className="text-subheader-2 font-bold text-brand-black">{selectedTier.monthly_price}€</p>
          </div>
        </div>

        <ul className="space-y-3 mb-8">
          {selectedTier.features.slice(0, 5).map((feat, i) => (
            <li key={i} className="flex items-center gap-3">
              <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
              <span className="text-p2 text-gray-4">{feat}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Add-ons */}
      <div className="max-w-lg mx-auto mb-10">
        <h4 className="text-subheader-2 font-bold text-brand-black mb-4 px-2">Add-ons Populares</h4>
        <div className="space-y-3">
          {proposal.addons_disponiveis?.map(addon => (
             <div 
              key={addon.id}
              className={`bg-gray-50 border border-gray-1 rounded-xl overflow-hidden transition-all duration-200 group ${selectedAddOns.includes(addon.id) ? 'ring-1 ring-primary/30 bg-primary/5' : 'hover:border-gray-300'}`}
             >
               <div 
                 onClick={() => onToggleAddOn(addon.id)}
                 className="flex items-center justify-between p-4 cursor-pointer"
               >
                 <div className="flex items-center gap-3 flex-1">
                   <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all flex-shrink-0 ${selectedAddOns.includes(addon.id) ? 'border-primary bg-primary' : 'border-gray-300'}`}>
                      {selectedAddOns.includes(addon.id) && <CheckIcon className="w-4 h-4 text-white" />}
                   </div>
                   <div>
                     <p className="text-p2 font-semibold text-brand-black leading-tight">{addon.name}</p>
                     <p className="text-xs text-gray-4 mt-0.5">{addon.description}</p>
                   </div>
                 </div>
                 
                 <div className="flex items-center gap-3 ml-2">
                   <p className="text-sm font-bold text-primary whitespace-nowrap">+{addon.setup_price}€</p>
                   <button
                     onClick={(e) => {
                       e.stopPropagation();
                       setExpandedAddonId(expandedAddonId === addon.id ? null : addon.id);
                     }}
                     className="p-1 text-gray-400 hover:text-brand-black hover:bg-black/5 rounded-full transition-colors"
                     aria-label="Expand details"
                   >
                     <ChevronDownIcon 
                       className={`w-5 h-5 transition-transform duration-200 ${expandedAddonId === addon.id ? 'rotate-180' : ''}`} 
                     />
                   </button>
                 </div>
               </div>

               <AnimatePresence>
                 {expandedAddonId === addon.id && (
                   <motion.div
                     initial={{ height: 0, opacity: 0 }}
                     animate={{ height: 'auto', opacity: 1 }}
                     exit={{ height: 0, opacity: 0 }}
                     className="overflow-hidden"
                   >
                     <div className="px-4 pb-4 pt-0 pl-[3.5rem]">
                        <div className="pt-3 border-t border-gray-200/50 space-y-3 text-sm">
                            {addon.detailed_solution && (
                                <div>
                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Para que serve?</p>
                                    <p className="text-gray-600 leading-relaxed">{addon.detailed_solution}</p>
                                </div>
                            )}
                            {addon.roi_impact && (
                                <div>
                                    <p className="text-[10px] font-bold text-[#41CE2A] uppercase tracking-widest mb-1">Impacto Esperado</p>
                                    <p className="text-gray-600 leading-relaxed">{addon.roi_impact}</p>
                                </div>
                            )}
                        </div>
                     </div>
                   </motion.div>
                 )}
               </AnimatePresence>
             </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default PricingExpress;
