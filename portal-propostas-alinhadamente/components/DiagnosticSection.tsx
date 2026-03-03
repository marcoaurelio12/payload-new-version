
import React from 'react';
import { ArrowRightIcon } from '@heroicons/react/24/solid';
import { ProposalDiagnostic } from '../types';

interface DiagnosticProps {
  diagnostic: ProposalDiagnostic;
}

const DiagnosticSection: React.FC<DiagnosticProps> = ({ diagnostic }) => {
  return (
    <div className="relative rounded-3xl overflow-hidden border border-black/5 dark:border-white/5 grid grid-cols-1 md:grid-cols-2 transition-colors">
      {/* Problem Side */}
      <div className="bg-red-50 dark:bg-red-900/10 p-12 border-b md:border-b-0 md:border-r border-black/5 dark:border-white/5 relative transition-colors">
        <div className="absolute top-6 left-6 px-3 py-1 bg-red-500/10 dark:bg-red-500/20 rounded-full border border-red-500/20 dark:border-red-500/30">
          <span className="text-[10px] text-red-600 dark:text-red-400 font-black uppercase tracking-widest">Cenário Atual</span>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-fluent text-gray-800 dark:text-white/80 mb-4 transition-colors">
             {diagnostic.problemLabel || 'Desafios & Riscos'}
          </h3>
          <p className="text-gray-600 dark:text-[#D1D1D1] leading-relaxed font-mono text-sm opacity-80 transition-colors">
            {diagnostic.problem}
          </p>
        </div>
      </div>

      {/* Solution Side */}
      <div className="bg-[#41CE2A]/5 p-12 relative transition-colors">
        <div className="absolute top-6 left-6 px-3 py-1 bg-[#41CE2A]/20 rounded-full border border-[#41CE2A]/30">
          <span className="text-[10px] text-[#41CE2A] font-black uppercase tracking-widest">Cenário Alinhadamente</span>
        </div>
        <div className="mt-8">
          <h3 className="text-2xl font-fluent text-gray-900 dark:text-white mb-4 transition-colors">
             {diagnostic.solutionLabel || 'Soberania & Performance'}
          </h3>
          <p className="text-gray-700 dark:text-white leading-relaxed font-mono text-sm transition-colors">
             {diagnostic.solution}
          </p>
        </div>
      </div>

      {/* Connector */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-[#1F1F1F] p-2 rounded-full border border-black/10 dark:border-white/10 hidden md:block z-10 transition-colors shadow-lg">
        <ArrowRightIcon className="w-6 h-6 text-gray-400 dark:text-[#D1D1D1]" />
      </div>
    </div>
  );
};

export default DiagnosticSection;
