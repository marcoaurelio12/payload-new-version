
import React from 'react';
import { motion } from 'framer-motion';
import { Testimonial } from '../types';
import { StarIcon } from '@heroicons/react/24/solid';

interface TestimonialsSectionProps {
  testimonials: Testimonial[];
}

const TestimonialsSection: React.FC<TestimonialsSectionProps> = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {testimonials.map((t, idx) => (
        <motion.div
          key={t.id}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ delay: idx * 0.2 }}
          viewport={{ once: true }}
          className="glass-card p-8 rounded-3xl relative transition-colors"
        >
          <div className="flex space-x-1 mb-6 text-[#41CE2A]">
             {[...Array(5)].map((_, i) => <StarIcon key={i} className="w-4 h-4" />)}
          </div>
          <p className="text-gray-700 dark:text-white text-lg italic leading-relaxed mb-6 font-light transition-colors">
            "{t.quote}"
          </p>
          <div className="flex items-center space-x-4 border-t border-black/5 dark:border-white/5 pt-6 transition-colors">
            {t.photo_url ? (
               <img src={t.photo_url} alt={t.client_name} className="w-10 h-10 rounded-full object-cover" />
            ) : (
                <div className="w-10 h-10 rounded-full bg-black/10 dark:bg-white/10 flex items-center justify-center text-xs font-bold text-gray-900 dark:text-white uppercase transition-colors">
                  {t.client_name.charAt(0)}
                </div>
            )}
            <div>
              <p className="text-gray-900 dark:text-white font-bold text-sm transition-colors">{t.client_name}</p>
              <p className="text-gray-500 dark:text-[#D1D1D1]/60 text-xs transition-colors">{t.role}, <span className="text-[#41CE2A]">{t.company}</span></p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TestimonialsSection;
