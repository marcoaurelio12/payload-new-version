
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';

const ExitIntent: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY < 10 && !hasTriggered) {
        setIsVisible(true);
        setHasTriggered(true);
      }
    };

    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [hasTriggered]);

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-6"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="bg-[#181818] border border-white/10 p-8 rounded-3xl max-w-md w-full relative shadow-2xl"
        >
          <button 
            onClick={() => setIsVisible(false)}
            className="absolute top-4 right-4 text-[#D1D1D1]/40 hover:text-white transition-colors"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>

          <div className="w-16 h-16 bg-[#41CE2A]/10 rounded-full flex items-center justify-center mb-6">
            <ArrowDownTrayIcon className="w-8 h-8 text-[#41CE2A]" />
          </div>

          <h3 className="text-2xl font-fluent text-white mb-2">Espere! Não vá de mãos vazias.</h3>
          <p className="text-[#D1D1D1]/60 text-sm mb-6 leading-relaxed">
            Antes de sair, descarregue o nosso Whitepaper técnico sobre <span className="text-white font-bold">"Soberania Digital para Advogados"</span>. Contém a checklist completa de compliance.
          </p>

          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); setIsVisible(false); }}>
            <input 
              type="email" 
              placeholder="seu@email.com" 
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:border-[#41CE2A] outline-none placeholder:text-[#D1D1D1]/20"
            />
            <button className="w-full py-3 bg-[#41CE2A] text-[#1F1F1F] font-bold rounded-xl hover:scale-[1.02] transition-transform">
              Enviar PDF Gratuito
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ExitIntent;
