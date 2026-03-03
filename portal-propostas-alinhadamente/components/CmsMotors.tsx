
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CmsMotor } from '../types';
import { getIcon } from '../constants';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CmsMotorsProps {
  motors: CmsMotor[];
}

const CmsMotors: React.FC<CmsMotorsProps> = ({ motors }) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (!motors || motors.length === 0) return null;

  return (
    <div className="space-y-4">
      {/* Dynamic Grid: Centers if fewer than 3, fills grid otherwise. Supports N items. */}
      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ${motors.length < 3 ? 'justify-center' : ''}`}>
        {motors.map((motor, index) => (
          <motion.div
            key={motor.id}
            layout
            onClick={() => setExpandedId(expandedId === motor.id ? null : motor.id)}
            className={`group relative p-8 glass-card rounded-2xl transition-all duration-500 cursor-pointer overflow-hidden border-2 flex flex-col ${
              expandedId === motor.id 
                ? 'border-[#41CE2A] bg-gray-50 dark:bg-white/[0.07]' 
                : 'border-transparent hover:border-black/5 dark:hover:border-white/10'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`text-[#41CE2A] transition-transform duration-500 ${expandedId === motor.id ? 'scale-125' : ''}`}>
                {getIcon(motor.icon)}
              </div>
              <motion.div animate={{ rotate: expandedId === motor.id ? 180 : 0 }} className="text-gray-400 dark:text-[#D1D1D1]/30 transition-colors">
                <ChevronDownIcon className="w-5 h-5" />
              </motion.div>
            </div>
            
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mt-6 mb-3 tracking-tight transition-colors">
              {motor.title}
            </h3>
            <p className="text-gray-600 dark:text-[#D1D1D1]/80 text-sm leading-relaxed mb-4 transition-colors">
              {motor.description}
            </p>

            <AnimatePresence>
              {expandedId === motor.id && motor.features && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="pt-4 border-t border-black/5 dark:border-white/5 space-y-3 transition-colors mt-auto"
                >
                  <p className="text-xs text-[#41CE2A] font-bold uppercase tracking-widest">Capacidades:</p>
                  <ul className="text-xs text-gray-500 dark:text-[#D1D1D1]/60 space-y-2 transition-colors">
                    {motor.features.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-start space-x-2">
                        <div className="w-1 h-1 bg-[#41CE2A] rounded-full mt-1.5 flex-shrink-0"></div>
                        <span>{feature.feature_text}</span>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CmsMotors;
