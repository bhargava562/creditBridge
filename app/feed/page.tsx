'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EvaluationResponse, BusinessInput, SchemeCardItem } from '@/lib/types';
import CashflowCard from '@/components/CashflowCard';
import SchemeCard from '@/components/SchemeCard';
import MissingItemsCard from '@/components/MissingItemsCard';
import sampleProfilesData from '@/data/sampleProfiles.json';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers,
  CheckCircle2,
  Filter,
  Check
} from 'lucide-react';

type FilterType = 'all' | 'likely_fit' | 'partial_fit' | 'missing_only';

export default function FeedPage() {
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rawProfile, setRawProfile] = useState<BusinessInput | null>(null);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    async function loadData() {
      try {
        const evalStr = sessionStorage.getItem('creditbridge_evaluation_result');
        const profileStr = sessionStorage.getItem('creditbridge_active_profile');
        const consentGranted = sessionStorage.getItem('creditbridge_consent_granted') === 'true';

        let activeProfile: BusinessInput;
        if (profileStr) {
          activeProfile = JSON.parse(profileStr);
        } else {
          activeProfile = sampleProfilesData[0] as BusinessInput;
          sessionStorage.setItem('creditbridge_active_profile', JSON.stringify(activeProfile));
        }
        setRawProfile(activeProfile);

        if (evalStr) {
          const parsed: EvaluationResponse = JSON.parse(evalStr);
          setEvaluation(parsed);
          if (parsed.schemeCards && parsed.schemeCards.length > 0) {
            setSelectedSchemeId(parsed.schemeCards[0].id);
            sessionStorage.setItem('creditbridge_selected_scheme', parsed.schemeCards[0].id);
          }
          setLoading(false);
        } else if (consentGranted) {
          // Re-fetch evaluation if consent was granted
          const res = await fetch('/api/evaluate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ input: activeProfile, consentGranted: true })
          });
          if (res.ok) {
            const data: EvaluationResponse = await res.json();
            setEvaluation(data);
            sessionStorage.setItem('creditbridge_evaluation_result', JSON.stringify(data));
            if (data.schemeCards.length > 0) {
              setSelectedSchemeId(data.schemeCards[0].id);
              sessionStorage.setItem('creditbridge_selected_scheme', data.schemeCards[0].id);
            }
          } else {
            router.push('/consent');
          }
          setLoading(false);
        } else {
          // Consent not granted, send back to consent
          router.push('/consent');
        }
      } catch {
        router.push('/');
      }
    }

    loadData();
  }, [router]);

  const handleSelectScheme = (schemeId: string) => {
    setSelectedSchemeId(schemeId);
    sessionStorage.setItem('creditbridge_selected_scheme', schemeId);
  };

  const handleProceedToApprove = () => {
    if (!selectedSchemeId) {
      alert('Please choose a scheme card to proceed.');
      return;
    }
    sessionStorage.setItem('creditbridge_selected_scheme', selectedSchemeId);
    router.push('/approve');
  };

  if (loading || !evaluation) {
    return (
      <div className="py-24 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-[#1E3A8A] border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-semibold text-[#111827]">
          Evaluating continuous cashflow velocity &amp; matching statutory central schemes...
        </p>
      </div>
    );
  }

  const applicant = evaluation.applicant;
  const selectedScheme: SchemeCardItem | undefined = evaluation.schemeCards.find(
    s => s.id === selectedSchemeId
  ) || evaluation.schemeCards[0];

  // Filter scheme cards
  const filteredSchemes = evaluation.schemeCards.filter((card) => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'likely_fit') return card.fitStatus === 'likely_fit';
    if (activeFilter === 'partial_fit') return card.fitStatus === 'partial_fit' || card.fitStatus === 'not_a_fit';
    return true;
  });

  return (
    <div className="space-y-8 animate-card-reveal pb-28">
      {/* Overview Top Header Card */}
      <div className="bento-card p-6 sm:p-7 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>Step 3 of 4: Recommendation Feed &amp; Readiness Bento</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight">
              {applicant.businessName}
            </h1>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#EEF1F6] text-slate-800 border border-[#E2E6EE] capitalize">
              {applicant.stage} unit • {applicant.sector.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[10px] uppercase text-[#4B5563] font-bold block tracking-wider">
              Requested Credit
            </span>
            <span className="text-lg sm:text-2xl font-extrabold text-emerald-800 font-mono-numbers">
              ₹{applicant.requestedAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="p-2.5 rounded-xl border border-[#E2E6EE] hover:bg-[#EEF1F6] text-[#4B5563] text-xs font-medium inline-flex items-center gap-1.5 touch-target transition-colors"
            title="Modify Intake Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Change Intake</span>
          </button>
        </div>
      </div>

      {/* Cashflow Time-Series Card */}
      <CashflowCard
        cashflow={evaluation.cashflow}
        timeSeriesData={rawProfile?.timeSeriesData}
        businessName={applicant.businessName}
      />

      {/* Scheme Recommendation Feed Section */}
      <div className="space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-5 h-5 text-[#1E3A8A]" />
              <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
                Statutory Scheme Recommendation Feed ({evaluation.schemeCards.length})
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#4B5563] mt-0.5">
              Ranked by statutory eligibility, loan ticket fit, and collateral-free government guarantee coverage.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 bg-[#EEF1F6] rounded-xl border border-[#E2E6EE] text-xs">
            <button
              type="button"
              onClick={() => setActiveFilter('all')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'all'
                  ? 'bg-white text-[#111827] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#111827]'
              }`}
            >
              All ({evaluation.schemeCards.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('likely_fit')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'likely_fit'
                  ? 'bg-white text-[#0F766E] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#0F766E]'
              }`}
            >
              Likely Fit ({evaluation.schemeCards.filter(c => c.fitStatus === 'likely_fit').length})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('partial_fit')}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeFilter === 'partial_fit'
                  ? 'bg-white text-[#B45309] shadow-xs'
                  : 'text-[#4B5563] hover:text-[#B45309]'
              }`}
            >
              Check Rule ({evaluation.schemeCards.filter(c => c.fitStatus !== 'likely_fit').length})
            </button>
          </div>
        </div>

        {/* Stacked Scheme Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredSchemes.map((scheme, idx) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              isSelected={selectedSchemeId === scheme.id}
              onSelect={handleSelectScheme}
              isTopRecommendation={idx === 0 && scheme.fitStatus === 'likely_fit'}
            />
          ))}
        </div>
      </div>

      {/* Missing Items & Verification Gaps */}
      <MissingItemsCard missingItems={evaluation.missingItems} />

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-4 left-4 right-4 max-w-7xl mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-[#E2E6EE] shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 z-40">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            <Check className="w-5 h-5 text-emerald-700" />
          </div>
          <div className="min-w-0">
            <div className="text-[11px] text-[#4B5563] font-bold uppercase tracking-wider">
              Selected Scheme for Authorization Slip:
            </div>
            <div className="text-sm sm:text-base font-extrabold text-[#111827] truncate">
              {selectedScheme?.schemeName || 'Select a Scheme Card Above'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
          <button
            type="button"
            onClick={() => router.push('/consent')}
            className="px-4 py-3 rounded-xl border border-[#E2E6EE] hover:bg-slate-100 text-[#111827] font-semibold text-xs touch-target transition-colors"
          >
            Review Consent
          </button>

          <button
            type="button"
            onClick={handleProceedToApprove}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-indigo-950/20 transition-all hover:gap-3 touch-target"
          >
            <span>Proceed to Step 4: Final Sign-Off</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
