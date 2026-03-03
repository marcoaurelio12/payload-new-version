
import React from 'react';
import { motion } from 'framer-motion';
import { PlayIcon } from '@heroicons/react/24/solid';
import { Proposal } from '../../types';

interface HeroExpressProps {
  proposal: Proposal;
}

const HeroExpress: React.FC<HeroExpressProps> = ({ proposal }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15, delayChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
  };

  return (
    <motion.section 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="relative bg-gradient-to-b from-white to-gray-50 pt-12 pb-16 px-5"
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 variants={item} className="text-h1-mobile md:text-h1 text-brand-black font-bold mb-4 text-center leading-tight">
          {proposal.hero.title}
        </motion.h1>

        {proposal.hero.loomUrl && (
          <motion.div variants={item} className="relative aspect-video bg-gray-900 rounded-2xl overflow-hidden mb-6 group cursor-pointer border-4 border-white shadow-2xl">
            <img 
              src={proposal.hero.thumbnailImage || "https://picsum.photos/seed/express/800/450"} 
              alt="Video Thumbnail" 
              className="w-full h-full object-cover opacity-80" 
            />
            <a 
              href={proposal.hero.loomUrl} 
              target="_blank" 
              rel="noreferrer"
              className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center group-hover:bg-black/30 transition-all duration-200"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-primary rounded-full flex items-center justify-center shadow-lg shadow-primary/50 group-hover:scale-110 transition-transform duration-200">
                <PlayIcon className="w-10 h-10 md:w-12 md:h-12 text-white ml-1" />
              </div>
            </a>
            <div className="absolute bottom-4 right-4 px-3 py-1.5 bg-black/80 backdrop-blur-sm text-white text-sm font-medium rounded-full">
              Ver Vídeo
            </div>
          </motion.div>
        )}

        {proposal.hero.description && (
          <motion.p variants={item} className="text-p1 text-gray-4 text-center mb-8 max-w-2xl mx-auto">
            {proposal.hero.description}
          </motion.p>
        )}

        <motion.div variants={item} className="flex flex-col gap-3">
          <button 
            onClick={() => document.getElementById('pricing-express')?.scrollIntoView({ behavior: 'smooth' })}
            className="w-full py-4 bg-primary hover:bg-primary-dark text-white text-p1 font-semibold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/30 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5"
          >
            Ver Investimento
          </button>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HeroExpress;
