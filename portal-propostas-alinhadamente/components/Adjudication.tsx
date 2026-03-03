import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { acceptProposalWithAuth, rejectProposalWithAuth } from '../services/api';

interface AdjudicationProps {
  proposalSlug: string;
  accessPass?: string; // Required for protected routes
  onStatusChange?: (status: 'accepted' | 'rejected') => void;
}

const Adjudication: React.FC<AdjudicationProps> = ({ proposalSlug, accessPass, onStatusChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleAdjudicate = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (accessPass) {
        // Use authenticated API
        await acceptProposalWithAuth(proposalSlug, accessPass);
      }

      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#40CE2A', '#ffffff', '#1F1F1F']
      });
      setIsSuccess(true);
      onStatusChange?.('accepted');
    } catch (err) {
      console.error("Failed to accept proposal:", err);
      setError(err instanceof Error ? err.message : 'Erro ao aceitar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReject = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      if (accessPass) {
        await rejectProposalWithAuth(proposalSlug, accessPass, rejectReason.trim() || undefined);
      }
      setIsRejected(true);
      setShowRejectModal(false);
      onStatusChange?.('rejected');
    } catch (err) {
      console.error("Failed to reject proposal:", err);
      setError(err instanceof Error ? err.message : 'Erro ao recusar proposta');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If already rejected
  if (isRejected) {
    return (
      <div className="relative max-w-4xl mx-auto py-24 px-10 glass-card rounded-[3rem] text-center border-2 border-gray-400 dark:border-gray-600 overflow-hidden shadow-lg transition-colors">
        <div className="relative z-10 py-10">
          <div className="w-24 h-24 bg-gray-400 dark:bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Proposta Recusada</h2>
          <p className="text-gray-600 dark:text-gray-1 text-lg mb-8 max-w-lg mx-auto leading-relaxed transition-colors">
            Obrigado pelo feedback. <br/>
            <span className="text-gray-500">A tua decisão foi registada.</span>
          </p>
          <div className="inline-block px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-mono text-gray-500 dark:text-gray-1/60 uppercase tracking-widest transition-colors">
            REF: {proposalSlug.toUpperCase()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="relative max-w-4xl mx-auto py-24 px-10 glass-card rounded-[3rem] text-center border-2 border-[#41CE2A] overflow-hidden shadow-[0_0_100px_rgba(65,206,42,0.15)] transition-colors">
        <div className="absolute inset-0 bg-gradient-to-b from-[#41CE2A]/10 to-transparent pointer-events-none"></div>

        <AnimatePresence mode="wait">
          {!isSuccess ? (
            <motion.div
              key="action"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative z-10"
            >
              <h2 className="text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 transition-colors">
                Aceitar Proposta e <br/>Iniciar Projeto
              </h2>
              <p className="text-gray-600 dark:text-gray-1 mb-12 text-lg max-w-xl mx-auto font-light transition-colors">
                Ao confirmar a proposta, o seu gestor de conta será notificado para dar início aos procedimentos de contrato e setup.
              </p>

              {/* Error Message */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500"
                >
                  {error}
                </motion.div>
              )}

              {/* Accept Button */}
              <div className="flex justify-center">
                <button
                  disabled={isSubmitting}
                  onClick={handleAdjudicate}
                  className={`group relative flex items-center justify-center px-8 sm:px-16 py-6 sm:py-8 bg-[#41CE2A] text-[#1F1F1F] font-black text-lg sm:text-2xl rounded-2xl transition-all duration-300 transform ${isSubmitting ? 'opacity-50 scale-95' : 'hover:scale-105 active:scale-95 hover:shadow-[0_0_50px_rgba(65,206,42,0.5)]'}`}
                >
                  <span className="absolute inset-0 rounded-2xl animate-ping border-4 border-[#41CE2A] opacity-20 pointer-events-none"></span>
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-[#1F1F1F]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      PROCESSANDO...
                    </span>
                  ) : (
                    "CONFIRMAR PROPOSTA"
                  )}
                </button>
              </div>

              {/* Reject Button */}
              <div className="mt-6">
                <button
                  onClick={() => setShowRejectModal(true)}
                  disabled={isSubmitting}
                  className="text-gray-500 dark:text-gray-1/60 hover:text-gray-700 dark:hover:text-gray-1 text-sm underline underline-offset-4 transition-colors"
                >
                  Não estou interessado
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="success"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative z-10 py-10"
            >
              <div className="w-24 h-24 bg-[#41CE2A] rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
                <svg className="w-12 h-12 text-[#1F1F1F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">Excelente escolha.</h2>
              <p className="text-gray-600 dark:text-gray-1 text-lg mb-8 max-w-lg mx-auto leading-relaxed transition-colors">
                O seu interesse foi registado com sucesso. <br/>
                <span className="text-[#41CE2A] font-bold">Entraremos em contacto brevemente.</span>
              </p>
              <div className="inline-block px-4 py-2 bg-black/5 dark:bg-white/5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-mono text-gray-500 dark:text-gray-1/60 uppercase tracking-widest transition-colors">
                REF: {proposalSlug.toUpperCase()}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowRejectModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md w-full shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 transition-colors">
                Recusar Proposta
              </h3>
              <p className="text-gray-600 dark:text-gray-1 mb-6 transition-colors">
                Tens a certeza que queres recusar esta proposta? Podes opcionalmente deixar um motivo.
              </p>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Motivo (opcional)"
                rows={3}
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
              />
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => setShowRejectModal(false)}
                  className="flex-1 py-3 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-1 font-bold rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReject}
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'A processar...' : 'Recusar'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Adjudication;
