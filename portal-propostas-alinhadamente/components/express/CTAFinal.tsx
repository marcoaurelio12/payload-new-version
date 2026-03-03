
import React, { useState } from 'react';
import { SparklesIcon, ShieldCheckIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';
import { Faq } from '../../types';

interface CTAFinalProps {
  faqs?: Faq[];
}

const CTAFinal: React.FC<CTAFinalProps> = ({ faqs = [] }) => {
  const [isSuccess, setIsSuccess] = useState(false);

  const handleAdjudicate = async () => {
    // @ts-ignore
    confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#40CE2A', '#191919', '#FFFFFF']
    });
    setIsSuccess(true);
  };

  return (
    <section className="py-16 px-5 bg-gradient-to-b from-gray-50 to-white pb-32">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-h2-mobile md:text-h2 text-brand-black font-bold text-center mb-8">Pronto para Avançar?</h2>
        
        <AnimatePresence mode="wait">
        {!isSuccess ? (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 shadow-2xl shadow-primary/30 mb-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
            <div className="relative z-10 text-center">
              <motion.div 
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }} 
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="inline-block mb-4"
              >
                <SparklesIcon className="w-10 h-10 text-white" />
              </motion.div>
              
              <button 
                onClick={handleAdjudicate}
                className="w-full py-5 bg-white text-primary font-bold text-subheader-2-mobile rounded-xl flex items-center justify-center gap-3 shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all duration-200 mb-3"
              >
                CONFIRMAR PROPOSTA
              </button>
              <p className="text-white/90 text-sm">Gera contrato e fatura automaticamente</p>
            </div>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-primary rounded-2xl p-8 text-center shadow-xl mb-8"
          >
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <ShieldCheckIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-subheader-2 font-bold text-brand-black mb-2">Sucesso!</h3>
            <p className="text-gray-4">O seu gestor de conta entrará em contacto brevemente.</p>
          </motion.div>
        )}
        </AnimatePresence>

        {faqs && faqs.length > 0 && (
          <div className="bg-white border border-gray-1 rounded-xl p-6">
            <h4 className="text-subheader-2 font-bold text-brand-black mb-4 flex items-center gap-2">
              <ShieldCheckIcon className="w-6 h-6 text-primary" />
              Perguntas Frequentes
            </h4>
            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="border-l-2 border-primary/20 pl-4">
                  <p className="text-p2 font-semibold text-brand-black mb-1">{faq.question}</p>
                  <p className="text-sm text-gray-4">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </section>
  );
};

export default CTAFinal;
