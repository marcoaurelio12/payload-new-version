
import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import Logo from './Logo';

interface HeaderProps {
  currentPage: 'proposal' | 'onboarding';
  onNavigate: (page: 'proposal' | 'onboarding') => void;
}

const NAV_LINKS = [
  { id: 'solucao', label: 'Solução' },
  { id: 'roadmap', label: 'Plano' },
  { id: 'investimento', label: 'Investimento' },
];

const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check local storage or system preference on mount
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme === 'dark') {
      setIsDark(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDark(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  const scrollTo = (id: string) => {
    if (currentPage !== 'proposal') {
      onNavigate('proposal');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-[#1F1F1F]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 no-print transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => onNavigate('proposal')}
        >
          <Logo height={32} />
        </div>

        <nav className="hidden lg:flex items-center space-x-8">
          {NAV_LINKS.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollTo(link.id)}
              className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 hover:text-[#41CE2A] dark:text-[#D1D1D1] dark:hover:text-[#41CE2A] transition-colors"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
           {/* Theme Toggle */}
           <button
             onClick={toggleTheme}
             className="p-2 text-gray-500 hover:text-gray-900 dark:text-[#D1D1D1]/60 dark:hover:text-white transition-colors border border-transparent hover:border-black/5 dark:hover:border-white/10 rounded-lg"
             title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
           >
             {isDark ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
           </button>
          
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full border border-[#41CE2A]/30 bg-[#41CE2A]/5">
            <div className="w-2 h-2 rounded-full bg-[#41CE2A] animate-pulse-green"></div>
            <span className="text-[10px] font-bold text-[#41CE2A] uppercase tracking-wider">Válida</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
