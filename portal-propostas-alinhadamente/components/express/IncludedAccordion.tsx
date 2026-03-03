
import React, { useState } from 'react';
import { ChevronDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { AnimatePresence, motion } from 'framer-motion';
import { IncludedItem } from '../../types';
import { getIcon } from '../../constants';

interface IncludedAccordionProps {
  items?: IncludedItem[];
}

const IncludedAccordion: React.FC<IncludedAccordionProps> = ({ items = [] }) => {
  const [openId, setOpenId] = useState<string | null>(items.length > 0 ? items[0].id : null);

  if (!items || items.length === 0) return null;

  return (
    <section className="py-12 px-5 bg-gray-50">
      <h2 className="text-h2-mobile md:text-h2 text-brand-black font-bold text-center mb-8">O Que Está Incluído</h2>
      <div className="max-w-3xl mx-auto space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-white border border-gray-1 rounded-xl overflow-hidden transition-shadow hover:shadow-md">
            <button 
              onClick={() => setOpenId(openId === item.id ? null : item.id)}
              className="w-full px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                  {getIcon(item.icon, "w-5 h-5 text-primary")}
                </div>
                <div className="text-left">
                  <h3 className="text-subheader-2-mobile font-semibold text-brand-black">{item.title}</h3>
                  <p className="text-sm text-gray-3">{item.subtitle}</p>
                </div>
              </div>
              <ChevronDownIcon 
                className={`w-5 h-5 text-gray-3 transition-transform duration-200 ${openId === item.id ? 'rotate-180' : ''}`} 
              />
            </button>
            <AnimatePresence>
              {openId === item.id && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="px-6 pb-5 pt-1 pl-20 border-t border-gray-100">
                    <ul className="space-y-2.5">
                      {item.features.map((feat, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckIcon className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-p2 text-gray-4 leading-relaxed">{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
};

export default IncludedAccordion;
