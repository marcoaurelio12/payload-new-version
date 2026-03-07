import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/solid';
import { PaymentModality } from '../types';

interface PaymentModalityToggleProps {
  value: PaymentModality;
  onChange: (modality: PaymentModality) => void;
}

const PaymentModalityToggle: React.FC<PaymentModalityToggleProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-50 dark:bg-black/20 p-2 rounded-2xl border border-black/5 dark:border-white/5">
      <div className="flex gap-2">
        {/* Annual Option - Pre-selected as best value */}
        <button
          onClick={() => onChange('annual')}
          className={`relative flex-1 py-4 px-6 rounded-xl transition-all duration-300 ${
            value === 'annual'
              ? 'bg-[#41CE2A] text-[#1F1F1F] shadow-lg shadow-[#41CE2A]/20'
              : 'bg-transparent text-gray-500 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          {value === 'annual' && (
            <motion.div
              layoutId="modality-indicator"
              className="absolute inset-0 bg-[#41CE2A] rounded-xl"
              initial={false}
              transition={{ type: 'spring', stiffness: 500, damping: 35 }}
            />
          )}
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">Anual</span>
              {value === 'annual' && (
                <div className="flex items-center gap-1 bg-[#1F1F1F]/20 px-2 py-0.5 rounded-full">
                  <SparklesIcon className="w-3 h-3" />
                  <span className="text-[9px] font-black uppercase tracking-wider">Melhor Valor</span>
                </div>
              )}
            </div>
            <span className={`text-xs mt-1 ${value === 'annual' ? 'text-[#1F1F1F]/70' : 'text-gray-400 dark:text-white/30'}`}>
              Poupa 23%
            </span>
          </div>
        </button>

        {/* Monthly Option */}
        <button
          onClick={() => onChange('monthly')}
          className={`relative flex-1 py-4 px-6 rounded-xl transition-all duration-300 ${
            value === 'monthly'
              ? 'bg-gray-200 dark:bg-white/10 text-gray-900 dark:text-white'
              : 'bg-transparent text-gray-500 dark:text-white/50 hover:bg-black/5 dark:hover:bg-white/5'
          }`}
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <span className="text-base font-bold">Mensal</span>
              <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${
                value === 'monthly'
                  ? 'bg-gray-300 dark:bg-white/20 text-gray-600 dark:text-gray-400'
                  : 'bg-gray-200 dark:bg-white/10 text-gray-500 dark:text-white/40'
              }`}>
                +23%
              </span>
            </div>
            <span className={`text-xs mt-1 ${value === 'monthly' ? 'text-gray-500 dark:text-white/50' : 'text-gray-400 dark:text-white/30'}`}>
              Maior flexibilidade
            </span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PaymentModalityToggle;
