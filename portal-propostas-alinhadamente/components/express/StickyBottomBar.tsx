
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRightIcon } from '@heroicons/react/24/solid';

interface StickyBottomBarProps {
  totalSetup: number;
  totalMonthly: number;
  onAdjudicate: () => void;
}

const StickyBottomBar: React.FC<StickyBottomBarProps> = ({ totalSetup, totalMonthly, onAdjudicate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-brand-black border-t-2 border-primary shadow-2xl pb-safe">
      <div className="max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-xs text-gray-400 mb-0.5 uppercase tracking-wide">Total Estimado</p>
          <div className="flex items-baseline gap-2">
             <span className="text-xl font-bold text-white">{totalSetup}€</span>
             <span className="text-sm text-gray-400">+ {totalMonthly}€/mês</span>
          </div>
        </div>

        <motion.button
          onClick={onAdjudicate}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-6 py-3 bg-primary hover:bg-primary-dark text-white font-bold text-sm rounded-xl flex items-center gap-2 shadow-lg shadow-primary/30 transition-colors whitespace-nowrap"
        >
          <span>Avançar</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      </div>
    </div>
  );
};

export default StickyBottomBar;
