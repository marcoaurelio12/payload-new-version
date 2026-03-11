
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlusIcon, MinusIcon, ShieldCheckIcon } from '@heroicons/react/24/outline';
import { Faq } from '../types';

interface FAQSectionProps {
  faqs: Faq[];
}

const FAQSection: React.FC<FAQSectionProps> = ({ faqs }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!faqs || faqs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
      <div>
        <h2 className="text-5xl font-fluent text-gray-900 dark:text-white mb-8 transition-colors">Deveres & Direitos</h2>
        <p className="text-gray-600 dark:text-[#D1D1D1]/60 text-lg font-light leading-relaxed transition-colors">
          Transparência radical é o nosso pilar. Como uma agência focada em Legal Tech, os nossos acordos são claros, justos e orientados à soberania digital da sua Sociedade.
        </p>
        <div className="mt-12 flex items-center space-x-4">
          <div className="p-4 bg-[#41CE2A]/10 rounded-2xl">
            <ShieldCheckIcon className="w-8 h-8 text-[#41CE2A]" />
          </div>
          <p className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest transition-colors">Proteção de Ativos Intelectuais</p>
        </div>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => (
          <div 
            key={idx}
            className={`border-b border-black/5 dark:border-white/5 transition-all duration-300 ${openIndex === idx ? 'pb-8' : 'pb-4'}`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
              className="w-full flex items-center justify-between py-4 text-left group"
            >
              <span className={`text-lg font-bold transition-colors ${openIndex === idx ? 'text-[#41CE2A]' : 'text-gray-900 dark:text-white group-hover:text-[#41CE2A] dark:group-hover:text-[#41CE2A]'}`}>
                {faq.question}
              </span>
              <div className="ml-4 flex-shrink-0">
                {openIndex === idx ? (
                  <MinusIcon className="w-5 h-5 text-[#41CE2A]" />
                ) : (
                  <PlusIcon className="w-5 h-5 text-gray-400 dark:text-[#D1D1D1]/30 transition-colors" />
                )}
              </div>
            </button>
            <AnimatePresence>
              {openIndex === idx && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div
                    className="text-gray-600 dark:text-[#D1D1D1]/60 leading-relaxed pt-2 transition-colors faq-answer"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQSection;
