
import React from 'react';
import { motion } from 'framer-motion';
import { Proposal } from '../types';

interface HeroProps {
  proposal: Proposal;
}

const Hero: React.FC<HeroProps> = ({ proposal }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-5xl lg:text-7xl font-fluent text-gray-900 dark:text-white mb-8 leading-tight transition-colors">
          {proposal.hero.title}
        </h1>
        {proposal.hero.description && (
          <p className="text-xl text-gray-600 dark:text-[#D1D1D1] mb-10 leading-relaxed font-light transition-colors">
            {proposal.hero.description}
          </p>
        )}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
          <button 
            onClick={() => document.getElementById('investimento')?.scrollIntoView({ behavior: 'smooth' })}
            className="px-8 py-4 bg-[#41CE2A] text-[#1F1F1F] font-bold rounded-xl hover:scale-105 active:scale-95 transition-transform"
          >
            Explorar Solução
          </button>
        </div>
      </motion.div>

      {/* Conditional Video Render */}
      {proposal.hero.loomUrl && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="relative group"
        >
          <div className="absolute -inset-1 bg-[#41CE2A] rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-1000"></div>
          <div className="relative rounded-2xl border-2 border-[#41CE2A] bg-black overflow-hidden shadow-2xl aspect-video">
            <img 
              src={proposal.hero.thumbnailImage || "https://picsum.photos/seed/legaltech/800/450"} 
              alt="Video Overview" 
              className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <a 
                href={proposal.hero.loomUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-20 h-20 rounded-full bg-[#41CE2A] flex items-center justify-center cursor-pointer hover:scale-110 transition-transform shadow-lg"
              >
                <svg className="w-8 h-8 text-[#1F1F1F] ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </a>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center space-x-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
              <span className="text-white text-xs font-mono">Ver Apresentação</span>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Hero;
