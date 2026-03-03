
import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheckIcon, ClockIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

const TrustSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="p-10 glass-card rounded-3xl flex flex-col justify-between"
      >
        <ShieldCheckIcon className="w-12 h-12 text-[#41CE2A] mb-8" />
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Soberania Total</h3>
          <p className="text-[#D1D1D1] text-sm leading-relaxed">
            Dados alojados exclusivamente em servidores geridos por si. Sem lock-in, sem fugas de informação. O seu código, as suas regras.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        viewport={{ once: true }}
        className="p-10 glass-card rounded-3xl flex flex-col justify-between border-t-2 border-t-[#41CE2A]"
      >
        <ClockIcon className="w-12 h-12 text-[#41CE2A] mb-8" />
        <div>
          <h3 className="text-2xl font-bold text-white mb-4">Suporte Alinhadamente</h3>
          <p className="text-[#D1D1D1] text-sm leading-relaxed">
            Equipa técnica de prontidão. Garantimos resposta a incidentes críticos em menos de 4 horas úteis.
          </p>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        viewport={{ once: true }}
        className="p-10 bg-white/5 rounded-3xl overflow-hidden relative group"
      >
        <div className="relative z-10 flex flex-col h-full justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-6">Trabalhamos com os Melhores</h3>
            <div className="grid grid-cols-2 gap-8 grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700">
               <div className="h-12 flex items-center justify-center border border-white/5 rounded-lg bg-white/5 font-mono text-[10px] uppercase tracking-tighter">Moraes.JS</div>
               <div className="h-12 flex items-center justify-center border border-white/5 rounded-lg bg-white/5 font-mono text-[10px] uppercase tracking-tighter">VdA_Corp</div>
               <div className="h-12 flex items-center justify-center border border-white/5 rounded-lg bg-white/5 font-mono text-[10px] uppercase tracking-tighter">LawForce</div>
               <div className="h-12 flex items-center justify-center border border-white/5 rounded-lg bg-white/5 font-mono text-[10px] uppercase tracking-tighter">Abreu_Labs</div>
            </div>
          </div>
          <div className="mt-8">
            <p className="text-[10px] font-bold text-[#41CE2A] uppercase tracking-widest">Confiança Inabalável</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 p-8">
          <GlobeAltIcon className="w-24 h-24 text-white opacity-[0.02] -rotate-12" />
        </div>
      </motion.div>
    </div>
  );
};

export default TrustSection;
