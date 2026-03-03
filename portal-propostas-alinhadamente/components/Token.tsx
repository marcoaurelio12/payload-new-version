
import React from 'react';

interface TokenProps {
  slug: string;
  suffix?: string;
  className?: string;
}

const Token: React.FC<TokenProps> = ({ slug, suffix = "", className = "" }) => (
  <span className={`text-[#41CE2A] font-mono bg-[#41CE2A]/10 px-1 rounded ${className}`}>
    {"{{"}{slug}{"}}"}{suffix}
  </span>
);

export default Token;
