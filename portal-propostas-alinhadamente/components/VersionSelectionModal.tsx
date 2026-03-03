
import React from 'react';
import { motion } from 'framer-motion';
import { BoltIcon, ChartBarIcon, CheckIcon } from '@heroicons/react/24/outline';
import Token from './Token';
import Logo from './Logo';

interface VersionSelectionModalProps {
  onSelect: (version: 'express' | 'complete') => void;
  proposalData: any;
}

const VersionSelectionModal: React.FC<VersionSelectionModalProps> = ({ onSelect, proposalData }) => {
  return (
    <div className="fixed inset-0 bg-brand-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 max-w-2xl w-full shadow-2xl relative overflow-hidden"
      >
        <div className="flex flex-col items-center text-center mb-8">
           <div className="flex items-center justify-center mb-4">
              <Logo height={32} />
           </div>
           <h2 className="text-h2-mobile md:text-h2 text-brand-black mb-2">
             Olá, <Token slug="proposal.cliente_name" /> 👋
           </h2>
           <p className="text-p1 text-gray-4">Como prefere explorar esta proposta?</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Express Option */}
          <div 
            onClick={() => onSelect('express')}
            className="relative p-6 rounded-xl border-2 bg-white border-primary hover:border-primary-dark transition-all duration-200 cursor-pointer group shadow-lg shadow-primary/10 hover:shadow-primary/20"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
              Recomendado (Mobile)
            </div>
            <BoltIcon className="w-12 h-12 mb-4 text-primary" />
            <h3 className="text-subheader-2 font-semibold text-brand-black mb-1">EXPRESS</h3>
            <p className="text-p2 text-gray-3 mb-4 font-bold">~3 minutos</p>
            <ul className="space-y-2 mb-6">
              {['Resumo Executivo', 'Investimento Direto', 'Next Steps'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-p2 text-gray-4">
                  <CheckIcon className="w-5 h-5 text-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg bg-primary hover:bg-primary-dark text-white font-semibold transition-colors duration-200">
              Escolher Express
            </button>
          </div>

          {/* Complete Option */}
          <div 
            onClick={() => onSelect('complete')}
            className="relative p-6 rounded-xl border-2 bg-white border-gray-1 hover:border-gray-3 transition-all duration-200 cursor-pointer group"
          >
             <ChartBarIcon className="w-12 h-12 mb-4 text-gray-4" />
             <h3 className="text-subheader-2 font-semibold text-brand-black mb-1">COMPLETA</h3>
             <p className="text-p2 text-gray-3 mb-4 font-bold">~15 minutos</p>
             <ul className="space-y-2 mb-6">
              {['Análise Detalhada', 'Calculadora ROI', 'Especificações Técnicas'].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-p2 text-gray-4">
                  <CheckIcon className="w-5 h-5 text-gray-3 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <button className="w-full py-3 rounded-lg border border-gray-3 text-gray-4 hover:bg-gray-1/10 font-semibold transition-colors duration-200">
              Escolher Completa
            </button>
          </div>
        </div>
        
        <p className="text-center text-p2 text-gray-3 mt-6">
          Pode alternar a visualização a qualquer momento no menu.
        </p>
      </motion.div>
    </div>
  );
};

export default VersionSelectionModal;
