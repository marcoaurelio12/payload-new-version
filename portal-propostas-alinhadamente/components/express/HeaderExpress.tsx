
import React, { useState } from 'react';
import { BoltIcon, Bars3Icon, CheckBadgeIcon } from '@heroicons/react/24/solid';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import Logo from '../Logo';

interface HeaderExpressProps {
  onSwitchVersion: () => void;
  proposalSlug: string;
}

const HeaderExpress: React.FC<HeaderExpressProps> = ({ onSwitchVersion, proposalSlug }) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 h-16 bg-white/95 backdrop-blur-md border-b border-gray-1 shadow-sm transition-shadow duration-200">
      <div className="max-w-7xl mx-auto px-5 h-full flex items-center justify-between">
        
        {/* Left: Logo & Badge */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Logo height={28} />
          </div>
          
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary cursor-default">
            <BoltIcon className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold text-primary">Express</span>
          </div>
        </div>

        {/* Right: Info & Menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm">
             <span className="text-gray-4 font-medium uppercase">{proposalSlug}</span>
             <div className="flex items-center gap-1.5 bg-gray-100 px-2 py-1 rounded">
               <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                </span>
                <span className="text-gray-600 text-xs font-bold">Válida</span>
             </div>
          </div>

          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="w-10 h-10 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bars3Icon className="w-6 h-6 text-brand-black" />
            </button>

            {menuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)}></div>
                <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl border border-gray-1 shadow-lg py-2 z-50">
                  <button 
                    onClick={() => document.getElementById('pricing-express')?.scrollIntoView({ behavior: 'smooth' })}
                    className="w-full text-left px-4 py-3 text-p2 text-brand-black hover:bg-gray-50 transition-colors"
                  >
                    Saltar para Investimento
                  </button>
                  <button 
                    onClick={onSwitchVersion}
                    className="w-full text-left px-4 py-3 text-p2 text-brand-black hover:bg-gray-50 transition-colors flex items-center gap-2"
                  >
                    <ArrowLeftIcon className="w-4 h-4" />
                    Ver Versão Completa
                  </button>
                  <div className="my-2 border-t border-gray-1"></div>
                  <button 
                    onClick={() => window.location.href="mailto:geral@alinhadamente.pt"}
                    className="w-full text-left px-4 py-3 text-p2 text-brand-black hover:bg-gray-50 transition-colors"
                  >
                    Contactar Consultor
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

      </div>
    </header>
  );
};

export default HeaderExpress;
