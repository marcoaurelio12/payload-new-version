import { useState, useEffect, useCallback } from 'react';
import { Proposal, SiteConfig, ProposalPreview, AuthError } from '../types';
import {
  checkProposalExists,
  verifyProposalAccess,
  transformApiProposal
} from '../services/api';

type AuthPhase = 'checking' | 'login' | 'verifying' | 'authenticated' | 'error';

interface UseProposalAuthReturn {
  phase: AuthPhase;
  proposalPreview: ProposalPreview | null;
  proposal: Proposal | null;
  siteConfig: SiteConfig | null;
  accessPass: string | null;
  error: AuthError | null;
  verifyCode: (code: string) => Promise<void>;
  reset: () => void;
}

// sessionStorage key for access pass persistence
const getSessionKey = (slug: string) => `proposal_access_${slug}`;

/**
 * Hook to manage proposal authentication flow
 *
 * Flow:
 * 1. checking -> call checkProposalExists(slug)
 * 2. login -> show login form with proposal preview
 * 3. verifying -> call verifyProposalAccess(slug, code)
 * 4. authenticated -> show proposal
 * 5. error -> show error screen
 */
export const useProposalAuth = (slug: string): UseProposalAuthReturn => {
  const [phase, setPhase] = useState<AuthPhase>('checking');
  const [proposalPreview, setProposalPreview] = useState<ProposalPreview | null>(null);
  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [accessPass, setAccessPass] = useState<string | null>(null);
  const [error, setError] = useState<AuthError | null>(null);

  // Check if proposal exists on mount
  useEffect(() => {
    const checkExists = async () => {
      if (!slug) {
        setError({
          type: 'not_found',
          message: 'Proposta não especificada'
        });
        setPhase('error');
        return;
      }

      try {
        setPhase('checking');
        setError(null);

        const preview = await checkProposalExists(slug);
        setProposalPreview(preview);

        // Check if proposal is expired
        if (preview.status === 'expired' || (preview.validUntil && new Date(preview.validUntil) < new Date())) {
          setError({
            type: 'expired',
            message: `Esta proposta expirou${preview.validUntil ? ` em ${new Date(preview.validUntil).toLocaleDateString('pt-PT')}` : ''}.`
          });
          setPhase('error');
          return;
        }

        // Check if proposal is already accepted or rejected
        if (preview.status === 'accepted') {
          setError({
            type: 'unknown',
            message: 'Esta proposta já foi aceite.'
          });
          setPhase('error');
          return;
        }

        if (preview.status === 'rejected') {
          setError({
            type: 'unknown',
            message: 'Esta proposta já foi recusada.'
          });
          setPhase('error');
          return;
        }

        // Check for stored access pass in sessionStorage (auto-login on page refresh)
        const storedAccessPass = sessionStorage.getItem(getSessionKey(slug));
        if (storedAccessPass) {
          // Try to verify with stored access pass
          try {
            setPhase('verifying');
            const apiProposal = await verifyProposalAccess(slug, storedAccessPass);
            const { proposal: transformedProposal, siteConfig: transformedConfig } = transformApiProposal(apiProposal);
            setProposal(transformedProposal);
            setSiteConfig(transformedConfig);
            setAccessPass(storedAccessPass);
            setPhase('authenticated');
            return;
          } catch (err) {
            // Stored pass is invalid, clear it and show login
            console.warn('Stored access pass is invalid:', err);
            sessionStorage.removeItem(getSessionKey(slug));
          }
        }

        setPhase('login');
      } catch (err) {
        console.error('Failed to check proposal:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar proposta';

        setError({
          type: errorMessage.includes('não encontrada') ? 'not_found' : 'network',
          message: errorMessage
        });
        setPhase('error');
      }
    };

    checkExists();
  }, [slug]);

  // Verify access code
  const verifyCode = useCallback(async (code: string) => {
    if (!code.trim()) {
      setError({
        type: 'invalid_code',
        message: 'Por favor insere o código de acesso.'
      });
      return;
    }

    try {
      setPhase('verifying');
      setError(null);

      const upperCode = code.toUpperCase().trim();
      const apiProposal = await verifyProposalAccess(slug, upperCode);
      const { proposal: transformedProposal, siteConfig: transformedConfig } = transformApiProposal(apiProposal);

      setProposal(transformedProposal);
      setSiteConfig(transformedConfig);
      setAccessPass(upperCode);

      // Store access pass in sessionStorage for persistence across page refreshes
      sessionStorage.setItem(getSessionKey(slug), upperCode);

      setPhase('authenticated');
    } catch (err) {
      console.error('Failed to verify code:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao verificar código';

      setError({
        type: errorMessage.includes('incorreto') || errorMessage.includes('inválido') ? 'invalid_code' : 'network',
        message: errorMessage
      });
      // Stay on login phase to allow retry
      setPhase('login');
    }
  }, [slug]);

  // Reset to login phase
  const reset = useCallback(() => {
    // Clear stored access pass
    if (slug) {
      sessionStorage.removeItem(getSessionKey(slug));
    }
    setPhase(proposalPreview ? 'login' : 'checking');
    setError(null);
    setProposal(null);
    setSiteConfig(null);
    setAccessPass(null);
  }, [slug, proposalPreview]);

  return {
    phase,
    proposalPreview,
    proposal,
    siteConfig,
    accessPass,
    error,
    verifyCode,
    reset
  };
};

export default useProposalAuth;
