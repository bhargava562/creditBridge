'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EvaluationResponse, BusinessInput } from '@/lib/types';
import CashflowCard from '@/components/CashflowCard';
import SchemeCard from '@/components/SchemeCard';
import MissingItemsCard from '@/components/MissingItemsCard';
import sampleProfilesData from '@/data/sampleProfiles.json';
import {
  Sparkles,
  ArrowRight,
  RotateCcw,
  Layers
} from 'lucide-react';

export default function FeedPage() {
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [rawProfile, setRawProfile] = useState<BusinessInput | null>(null);

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
      alert('Please select a scheme card to proceed.');
      return;
    }
    sessionStorage.setItem('creditbridge_selected_scheme', selectedSchemeId);
    router.push('/approve');
  };

  if (loading || !evaluation) {
    return (
      <div className="py-16 text-center space-y-3">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-sm font-medium text-slate-600">
          Running deterministic cashflow time-series analysis and statutory scheme matching...
        </p>
      </div>
    );
  }

  const applicant = evaluation.applicant;
  const selectedScheme = evaluation.schemeCards.find(s => s.id === selectedSchemeId) || evaluation.schemeCards[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Banner & Profile Overview */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-2 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step 3 of 4: Scheme Feed & Cashflow Gaps</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              {applicant.businessName}
            </h1>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 capitalize">
              {applicant.stage} unit • {applicant.sector.replace('_', ' ')}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[10px] uppercase text-slate-400 font-semibold block">Requested Credit</span>
            <span className="text-base sm:text-lg font-black text-emerald-700">
              ₹{applicant.requestedAmount.toLocaleString('en-IN')}
            </span>
          </div>

          <button
            type="button"
            onClick={() => router.push('/')}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-medium inline-flex items-center gap-1"
            title="Modify Intake Parameters"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Edit Intake</span>
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
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900">
                Rule-Cited Scheme Recommendation Feed ({evaluation.schemeCards.length})
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by statutory eligibility, credit ticket fit, and collateral-free government guarantee coverage.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> Likely Fit
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block"></span> Check Rule
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block"></span> Not a Fit
            </span>
          </div>
        </div>

        {/* Scheme Cards Feed */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {evaluation.schemeCards.map((scheme) => (
            <SchemeCard
              key={scheme.id}
              scheme={scheme}
              isSelected={selectedSchemeId === scheme.id}
              onSelect={handleSelectScheme}
            />
          ))}
        </div>
      </div>

      {/* Missing Items & Verification Gaps */}
      <MissingItemsCard missingItems={evaluation.missingItems} />

      {/* Bottom Sticky Handoff Bar */}
      <div className="sticky bottom-4 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 border border-slate-300 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4 z-30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-lg shrink-0">
            ✓
          </div>
          <div>
            <div className="text-[11px] text-slate-500 font-semibold uppercase">
              Active Scheme Selection for Sign-Off:
            </div>
            <div className="text-sm font-extrabold text-slate-900 line-clamp-1">
              {selectedScheme?.schemeName || 'Select a Scheme'}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            type="button"
            onClick={() => router.push('/consent')}
            className="px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs"
          >
            Review Consent
          </button>

          <button
            type="button"
            onClick={handleProceedToApprove}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:gap-3"
          >
            <span>Proceed to Final Sign-Off (Approval Gate #2)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
