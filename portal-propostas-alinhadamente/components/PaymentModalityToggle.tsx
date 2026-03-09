import React from 'react';
import { motion } from 'framer-motion';
import { PaymentModality } from '../types';

interface PaymentModalityToggleProps {
  value: PaymentModality;
  onChange: (modality: PaymentModality) => void;
}

const PaymentModalityToggle: React.FC<PaymentModalityToggleProps> = ({ value, onChange }) => {
  return (
    <div className="bg-gray-100 dark:bg-white/5 p-1.5 rounded-2xl">
      <div className="flex gap-1">
          {/* Annual Option */}
          <button
            onClick={() => onChange('annual')}
            className="relative flex-1"
          >
            {value === 'annual' && (
              <motion.div
                layoutId="modality-indicator"
                className="absolute inset-0 bg-[#22c55e] rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <div className={`relative z-10 py-4 px-6 rounded-xl flex items-center justify-center gap-3 transition-colors duration-200 ${
              value === 'annual'
                ? 'text-white'
                : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15'
            }`}>
              <span className="text-base font-bold">Anual</span>
              {value === 'annual' && (
                <span className="bg-white text-[#22c55e] text-[10px] font-bold px-2 py-0.5 rounded-md">
                  Poupa 23%
                </span>
              )}
            </div>
          </button>

          {/* Monthly Option */}
          <button
            onClick={() => onChange('monthly')}
            className="relative flex-1"
          >
            {value === 'monthly' && (
              <motion.div
                layoutId="modality-indicator"
                className="absolute inset-0 bg-gray-300 dark:bg-white/15 rounded-xl"
                initial={false}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
              />
            )}
            <div className={`relative z-10 py-4 px-6 rounded-xl flex items-center justify-center transition-colors duration-200 ${
              value === 'monthly'
                ? 'text-gray-700 dark:text-white'
                : 'bg-gray-200 dark:bg-white/10 text-gray-600 dark:text-white/70 hover:bg-gray-300 dark:hover:bg-white/15'
            }`}>
              <span className="text-base font-bold">Mensal</span>
            </div>
          </button>
      </div>
    </div>
  );
};

export default PaymentModalityToggle;
