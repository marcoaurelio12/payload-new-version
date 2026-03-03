import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ProposalPreview, AuthError } from '../types';
import Logo from './Logo';

interface AuthScreenProps {
  proposalPreview: ProposalPreview;
  isVerifying: boolean;
  error: AuthError | null;
  onVerify: (accessPass: string) => Promise<void>;
}

const AuthScreen: React.FC<AuthScreenProps> = ({
  proposalPreview,
  isVerifying,
  error,
  onVerify
}) => {
  const [accessCode, setAccessCode] = useState('');
  const [isDark, setIsDark] = useState(false);

  // Check dark mode
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains('dark'));
    };
    checkDark();

    // Observer for class changes
    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  // Auto-uppercase input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    setAccessCode(value);
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (accessCode.trim()) {
      await onVerify(accessCode.trim());
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo height={40} />
        </div>

        {/* Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-black/5 dark:border-white/5 transition-colors duration-300">
          {/* Title */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 transition-colors">
              Aceder à Proposta
            </h1>
            <p className="text-gray-600 dark:text-gray-1 transition-colors">
              <span className="font-medium text-gray-900 dark:text-white">{proposalPreview.title}</span>
              {proposalPreview.clientName && (
                <>
                  <br />
                  <span className="text-sm">para {proposalPreview.clientName}</span>
                </>
              )}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 dark:text-gray-1 mb-2 transition-colors">
                Insere o código de acesso que recebeste no email
              </label>
              <input
                type="text"
                id="accessCode"
                value={accessCode}
                onChange={handleInputChange}
                placeholder="Ex: VERAO25"
                maxLength={20}
                autoComplete="off"
                autoFocus
                className="w-full px-4 py-3 text-center text-xl font-mono tracking-widest rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-1 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all duration-200"
              />
            </div>

            {/* Error Message */}
            {error && error.type === 'invalid_code' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center space-x-2 text-red-500 text-sm"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error.message}</span>
              </motion.div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isVerifying || !accessCode.trim()}
              className={`w-full py-4 bg-primary text-gray-900 font-bold rounded-xl transition-all duration-300 transform ${
                isVerifying || !accessCode.trim()
                  ? 'opacity-50 cursor-not-allowed'
                  : 'hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/25'
              }`}
            >
              {isVerifying ? (
                <span className="flex items-center justify-center space-x-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>A VERIFICAR...</span>
                </span>
              ) : (
                'ACEDER'
              )}
            </button>
          </form>

          {/* Help Text */}
          <p className="mt-6 text-center text-xs text-gray-400 dark:text-gray-1/60 transition-colors">
            Não recebeste o código? Contacta-nos em{' '}
            <a href="mailto:geral@alinhadamente.pt" className="text-primary hover:underline">
              geral@alinhadamente.pt
            </a>
          </p>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-1/40 transition-colors">
          © {new Date().getFullYear()} Alinhadamente. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
};

export default AuthScreen;
