
import React, { useState } from 'react';
import { Proposal, PricingTier } from '../types';
import HeaderExpress from './express/HeaderExpress';
import HeroExpress from './express/HeroExpress';
import TrustBarExpress from './express/TrustBarExpress';
import DiagnosticSwiper from './express/DiagnosticSwiper';
import IncludedAccordion from './express/IncludedAccordion';
import PricingExpress from './express/PricingExpress';
import CTAFinal from './express/CTAFinal';
import StickyBottomBar from './express/StickyBottomBar';

interface ProposalExpressProps {
  proposalData: Proposal;
  onSwitchVersion: () => void;
}

const ProposalExpress: React.FC<ProposalExpressProps> = ({ proposalData, onSwitchVersion }) => {
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  // Default to recommended tier or first
  const recommendedTier = proposalData.pricing.tiers?.find(t => t.recommended) || proposalData.pricing.tiers?.[0] || { id: 'base', name: 'Base', setup_price: proposalData.pricing.setupPrice, monthly_price: proposalData.pricing.monthlyBase, features: [] };
  const [selectedTier, setSelectedTier] = useState<PricingTier>(recommendedTier);

  const toggleAddOn = (id: string) => {
    setSelectedAddOns(prev => prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]);
  };

  const calculateTotals = () => {
    const selectedData = (proposalData.addons_disponiveis || []).filter(a => selectedAddOns.includes(a.id));
    const setupAddons = selectedData.reduce((sum, a) => sum + a.setup_price, 0);
    const monthlyAddons = selectedData.reduce((sum, a) => sum + a.monthly_price, 0);
    
    return {
      setup: selectedTier.setup_price + setupAddons,
      monthly: selectedTier.monthly_price + monthlyAddons
    };
  };

  const totals = calculateTotals();

  const handleScrollToPricing = () => {
    document.getElementById('pricing-express')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-brand-black pb-20">
      <HeaderExpress onSwitchVersion={onSwitchVersion} proposalSlug={proposalData.slug} />
      
      <main>
        <HeroExpress proposal={proposalData} />
        <TrustBarExpress />
        {proposalData.diagnostic && (
          <DiagnosticSwiper 
            problemSlug="proposal.diagnostic_problem" 
            solutionSlug="proposal.diagnostic_solution" 
          />
        )}
        <IncludedAccordion items={proposalData.included_items} />
        <PricingExpress 
          proposal={proposalData}
          selectedTier={selectedTier}
          onSelectTier={setSelectedTier}
          selectedAddOns={selectedAddOns}
          onToggleAddOn={toggleAddOn}
          totalMonthly={totals.monthly}
          totalSetup={totals.setup}
        />
        <CTAFinal faqs={proposalData.faqs} />
      </main>

      <StickyBottomBar 
        totalSetup={totals.setup} 
        totalMonthly={totals.monthly} 
        onAdjudicate={handleScrollToPricing}
      />
    </div>
  );
};

export default ProposalExpress;
