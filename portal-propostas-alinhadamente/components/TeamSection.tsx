
import React from 'react';
import { motion } from 'framer-motion';
import { TeamMember } from '../types';
import Token from './Token';

interface TeamSectionProps {
  team: TeamMember[];
}

const TeamSection: React.FC<TeamSectionProps> = ({ team }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-12">
      {team.map((member, idx) => (
        <motion.div
          key={member.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.2 }}
          viewport={{ once: true }}
          className="flex items-start space-x-6 group"
        >
          <div className="w-24 h-24 rounded-2xl overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-500 shrink-0 border border-black/10 dark:border-white/10">
            <img 
              src={member.image_url} 
              alt={member.name} 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
             <h4 className="text-xl font-fluent text-gray-900 dark:text-white transition-colors"><Token slug={`team[${idx}].name`} /></h4>
             <p className="text-[#41CE2A] text-xs font-bold uppercase tracking-widest mb-3"><Token slug={`team[${idx}].role`} /></p>
             <p className="text-gray-600 dark:text-[#D1D1D1]/60 text-sm leading-relaxed transition-colors"><Token slug={`team[${idx}].bio`} /></p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default TeamSection;
