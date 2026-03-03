import React from 'react';
import { motion } from 'framer-motion';
import { AuthError } from '../types';
import Logo from './Logo';

interface ErrorScreenProps {
  error: AuthError;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error, onRetry }) => {
  const getErrorIcon = () => {
    switch (error.type) {
      case 'not_found':
        return (
          <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'expired':
        return (
          <svg className="w-16 h-16 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case 'network':
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414" />
          </svg>
        );
      default:
        return (
          <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        );
    }
  };

  const getTitle = () => {
    switch (error.type) {
      case 'not_found':
        return 'Proposta não encontrada';
      case 'expired':
        return 'Proposta expirada';
      case 'network':
        return 'Erro de ligação';
      default:
        return 'Algo correu mal';
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 transition-colors duration-300 p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md text-center"
      >
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Logo height={40} />
        </div>

        {/* Error Card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl border border-black/5 dark:border-white/5 transition-colors duration-300">
          <div className="flex justify-center mb-6">
            {getErrorIcon()}
          </div>

          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
            {getTitle()}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8 transition-colors">
            {error.message}
          </p>

          {onRetry && error.type === 'network' && (
            <button
              onClick={onRetry}
              className="w-full py-4 bg-primary text-gray-900 font-bold rounded-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg hover:shadow-primary/25"
            >
              Tentar novamente
            </button>
          )}

          {error.type !== 'network' && (
            <a
              href="mailto:geral@alinhadamente.pt"
              className="inline-block w-full py-4 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-bold rounded-xl transition-all duration-300 hover:bg-gray-200 dark:hover:bg-gray-600"
            >
              Contactar suporte
            </a>
          )}
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-xs text-gray-400 dark:text-gray-500 transition-colors">
          © {new Date().getFullYear()} Alinhadamente. Todos os direitos reservados.
        </p>
      </motion.div>
    </div>
  );
};

export default ErrorScreen;
