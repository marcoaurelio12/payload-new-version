
import React from 'react';
import { CodeBracketIcon, ShieldCheckIcon, CloudIcon } from '@heroicons/react/24/outline';

const TrustBar: React.FC = () => {
  const badgeData = [
    { icon: CodeBracketIcon, text1: 'Sem Vendor Lock-in', text2: 'Stack Open Source' },
    { icon: ShieldCheckIcon, text1: 'GDPR Compliant', text2: 'Dados em Solo Europeu' },
    { icon: CloudIcon, text1: 'Soberania Digital', text2: 'Infraestrutura Dedicada' }
  ];

  return (
    <div className="w-full border-y border-black/5 dark:border-white/5 bg-black/[0.02] dark:bg-white/[0.02] transition-colors">
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {badgeData.map((badge, idx) => (
            <div key={idx} className="flex items-center justify-center space-x-3 opacity-60 hover:opacity-100 transition-opacity">
              <badge.icon className="w-6 h-6 text-[#41CE2A]" />
              <div className="flex flex-col">
                <span className="text-xs text-gray-900 dark:text-white font-bold uppercase tracking-wider transition-colors">
                  {badge.text1}
                </span>
                <span className="text-[10px] text-gray-500 dark:text-[#D1D1D1] hidden sm:block transition-colors">
                  {badge.text2}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrustBar;
