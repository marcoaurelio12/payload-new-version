
import React, { useRef, useState } from 'react';
import { ExclamationTriangleIcon, CheckBadgeIcon } from '@heroicons/react/24/solid';

interface DiagnosticSwiperProps {
  problemSlug: string; // Used as content in new structure, but keeping prop name for compat
  solutionSlug: string; // Used as content
}

const DiagnosticSwiper: React.FC<DiagnosticSwiperProps> = ({ problemSlug, solutionSlug }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = () => {
    if (scrollRef.current) {
      const x = scrollRef.current.scrollLeft;
      const w = scrollRef.current.offsetWidth;
      const index = Math.round(x / w);
      setActiveIndex(index);
    }
  };

  return (
    <section className="py-12 px-5 bg-white">
      <h2 className="text-h2-mobile md:text-h2 text-brand-black font-bold text-center mb-3">Diagnóstico</h2>
      <p className="text-p2 text-gray-3 text-center mb-8 md:hidden">Deslize para comparar cenários</p>

      <div className="max-w-4xl mx-auto relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4 md:grid md:grid-cols-2 md:overflow-visible md:snap-none md:pb-0"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* PROBLEM CARD */}
          <div className="min-w-[85vw] md:min-w-0 snap-center md:snap-align-none bg-red-50 border-l-4 border-danger rounded-xl p-6 shadow-sm h-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-danger/20 rounded-lg flex items-center justify-center">
                <ExclamationTriangleIcon className="w-6 h-6 text-danger" />
              </div>
              <h3 className="text-subheader-2 font-bold text-danger">Cenário Atual</h3>
            </div>
            <div className="text-p2 text-gray-6 leading-relaxed">
              {problemSlug || "Dados dispersos e risco elevado."}
            </div>
          </div>

          {/* SOLUTION CARD */}
          <div className="min-w-[85vw] md:min-w-0 snap-center md:snap-align-none bg-primary/5 border-l-4 border-primary rounded-xl p-6 shadow-sm h-full">
             <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-primary/20 rounded-lg flex items-center justify-center">
                <CheckBadgeIcon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-subheader-2 font-bold text-primary">Cenário Alinhadamente</h3>
            </div>
            <div className="text-p2 text-gray-6 leading-relaxed">
              {solutionSlug || "Infraestrutura soberana e segura."}
            </div>
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-4 md:hidden">
          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${activeIndex === 0 ? 'bg-danger scale-125' : 'bg-gray-200'}`} />
          <div className={`w-2 h-2 rounded-full transition-all duration-200 ${activeIndex === 1 ? 'bg-primary scale-125' : 'bg-gray-200'}`} />
        </div>
      </div>
    </section>
  );
};

export default DiagnosticSwiper;
