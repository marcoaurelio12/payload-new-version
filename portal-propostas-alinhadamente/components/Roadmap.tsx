
import React from 'react';
import { motion } from 'framer-motion';
import { UserIcon, BuildingOffice2Icon } from '@heroicons/react/24/solid';
import { RoadmapPhase } from '../types';

interface RoadmapProps {
  phases: RoadmapPhase[];
}

const Roadmap: React.FC<RoadmapProps> = ({ phases }) => {
  return (
    <div className="relative">
      {/* Connector Line for Desktop */}
      <div className="absolute left-[50%] top-0 bottom-0 w-px bg-black/10 dark:bg-white/10 hidden md:block transition-colors"></div>

      <div className="space-y-16">
        {phases.map((phase, idx) => (
          <motion.div 
            key={idx}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            viewport={{ once: true }}
            className="relative grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-24"
          >
            {/* Center Node */}
            <div className="hidden md:flex absolute left-[50%] top-0 -translate-x-1/2 flex-col items-center">
              <div className="w-8 h-8 rounded-full bg-white dark:bg-[#1F1F1F] border-2 border-[#41CE2A] flex items-center justify-center z-10 transition-colors">
                <span className="text-[10px] font-bold text-gray-900 dark:text-white transition-colors">{phase.phase}</span>
              </div>
              <div className="mt-2 bg-white dark:bg-[#1F1F1F] px-2 py-1 rounded border border-[#41CE2A]/30 transition-colors">
                <span className="text-[9px] font-mono text-[#41CE2A] whitespace-nowrap">
                  {phase.duration}
                </span>
              </div>
            </div>

            {/* Mobile Header */}
            <div className="md:hidden flex items-center space-x-3 mb-2">
              <div className="w-6 h-6 rounded-full bg-[#41CE2A] flex items-center justify-center text-[#1F1F1F] font-bold text-xs">
                {phase.phase}
              </div>
              <h4 className="text-xl font-bold text-gray-900 dark:text-white transition-colors">{phase.title}</h4>
              <span className="text-xs text-[#41CE2A] border border-[#41CE2A]/30 px-2 py-0.5 rounded">
                {phase.duration}
              </span>
            </div>

            {/* Left Side: Agency Tasks */}
            <div className="bg-black/5 dark:bg-white/5 p-6 rounded-2xl border border-black/5 dark:border-white/5 md:text-right relative group hover:border-[#41CE2A]/30 transition-colors">
              <div className="absolute top-4 right-4 md:right-auto md:left-4 opacity-10">
                <BuildingOffice2Icon className="w-6 h-6 text-black dark:text-white" />
              </div>
              <h5 className="text-[#41CE2A] font-bold uppercase text-xs tracking-widest mb-4">Responsabilidade Alinhadamente</h5>
              <ul className="space-y-3">
                {phase.agency_tasks.map((task, tIdx) => (
                  <li key={tIdx} className="text-sm text-gray-600 dark:text-[#D1D1D1]/80 flex md:flex-row-reverse items-center gap-3 transition-colors">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#41CE2A] shrink-0"></div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Right Side: Client Tasks */}
            <div className="bg-[#41CE2A]/5 p-6 rounded-2xl border border-[#41CE2A]/20 relative group hover:border-[#41CE2A]/50 transition-colors">
              <div className="absolute top-4 right-4 opacity-10">
                <UserIcon className="w-6 h-6 text-[#41CE2A]" />
              </div>
              <h5 className="text-gray-900 dark:text-white font-bold uppercase text-xs tracking-widest mb-4 transition-colors">A Sua Missão</h5>
              <ul className="space-y-3">
                 {phase.client_tasks.map((task, tIdx) => (
                  <li key={tIdx} className="text-sm text-gray-600 dark:text-[#D1D1D1] flex items-center gap-3 transition-colors">
                    <div className="w-4 h-4 rounded border border-black/10 dark:border-white/20 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded bg-transparent group-hover:bg-[#41CE2A] transition-colors"></div>
                    </div>
                    <span>{task}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Roadmap;
