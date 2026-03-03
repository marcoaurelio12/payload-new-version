
import React from 'react';
import { ShieldCheckIcon, LockClosedIcon, CodeBracketIcon } from '@heroicons/react/24/outline';

const TrustBarExpress: React.FC = () => {
  const trustBadges = [
    {
      icon: <ShieldCheckIcon className="w-5 h-5 text-primary" />,
      label: "Propriedade Total",
      description: "Código 100% seu. Sem vendor lock-in."
    },
    {
      icon: <LockClosedIcon className="w-5 h-5 text-primary" />,
      label: "GDPR Compliant",
      description: "Dados em servidores europeus (Alemanha)."
    },
    {
      icon: <CodeBracketIcon className="w-5 h-5 text-primary" />,
      label: "Open Source",
      description: "Stack auditável e seguro."
    }
  ];

  return (
    <div className="bg-primary/5 border-y border-primary/20 py-6 px-5">
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6">
        {trustBadges.map((badge, idx) => (
          <div key={idx} className="flex items-start gap-3 group">
            <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              {badge.icon}
            </div>
            <div>
              <p className="text-p2 font-semibold text-brand-black mb-0.5">{badge.label}</p>
              <p className="text-sm text-gray-4 leading-tight">{badge.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TrustBarExpress;
