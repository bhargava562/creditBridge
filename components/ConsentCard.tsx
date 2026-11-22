'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessInput, EvaluationResponse } from '@/lib/types';
import sampleProfilesData from '@/data/sampleProfiles.json';
import {
  ShieldAlert,
  CheckCircle2,
  XCircle,
  Lock,
  Eye,
  FileCheck2,
  ArrowLeft,
  ArrowRight,
  AlertTriangle,
  RotateCcw,
  Stamp,
  Fingerprint
} from 'lucide-react';

export default function ConsentCard() {
  const router = useRouter();
  const [profile, setProfile] = useState<BusinessInput | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [declined, setDeclined] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('creditbridge_active_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        const fallback = sampleProfilesData[0] as BusinessInput;
        setProfile(fallback);
        sessionStorage.setItem('creditbridge_active_profile', JSON.stringify(fallback));
      }
    } catch {
      const fallback = sampleProfilesData[0] as BusinessInput;
      setProfile(fallback);
    }
  }, []);

  const handleGrantConsent = async () => {
    if (!profile) return;
    setLoading(true);
    setErrorMessage(null);

    try {
      sessionStorage.setItem('creditbridge_consent_granted', 'true');

      // Call API Handler POST /api/evaluate
      const res = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          input: profile,
          consentGranted: true
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || 'Evaluation request failed');
      }

      const evalData: EvaluationResponse = await res.json();
      sessionStorage.setItem('creditbridge_evaluation_result', JSON.stringify(evalData));
      router.push('/feed');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An unexpected error occurred while analyzing cashflow.';
      setErrorMessage(message);
      setLoading(false);
    }
  };

  const handleDeclineConsent = () => {
    sessionStorage.setItem('creditbridge_consent_granted', 'false');
    sessionStorage.removeItem('creditbridge_evaluation_result');
    setDeclined(true);
  };

  if (!profile) {
    return (
      <div className="py-20 text-center text-[#4B5563] text-sm">
        Loading evaluation session...
      </div>
    );
  }

  // Calm, clean stop state if declined
  if (declined) {
    return (
      <div className="max-w-2xl mx-auto bento-card p-8 sm:p-10 text-center space-y-6 animate-card-reveal">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 border border-[#E2E6EE]">
          <XCircle className="w-8 h-8 text-slate-400" />
        </div>

        <div className="space-y-2">
          <div className="inline-block px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-mono-numbers font-bold">
            STATUS: EVALUATION STOPPED
          </div>
          <h2 className="text-2xl font-bold text-[#111827]">
            Session Stopped by Entrepreneur Decision
          </h2>
          <p className="text-sm text-[#4B5563] max-w-lg mx-auto leading-relaxed">
            You declined consent. In strict accordance with CreditBridge privacy principles, <strong>zero cashflow or transaction records were read, analyzed, or stored</strong> for <span className="font-semibold text-[#111827]">{profile.businessName}</span>.
          </p>
        </div>

        <div className="p-4 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] text-xs text-[#4B5563] text-left space-y-2">
          <div className="font-bold text-[#111827] flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-[#1E3A8A]" />
            <span>Privacy &amp; Data Integrity Guarantee</span>
          </div>
          <p>
            No inquiry was transmitted to any bank, credit bureau, JanSamarth portal, or financial institution. You may restart or modify your intake parameters anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setDeclined(false);
              router.push('/');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#111827] hover:bg-black text-white font-semibold text-xs transition-colors touch-target"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Intake Screen</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-card-reveal">
      {/* Top Breadcrumb & Status */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 2 of 4: Explicit Consent Gate #1</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-xs text-[#4B5563] hover:text-[#111827] inline-flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Intake</span>
        </button>
      </div>

      {/* Main Ledger Slip Authorization Card */}
      <div className="gate-slip p-6 sm:p-10 space-y-7 relative overflow-hidden">
        {/* Subtle background seal */}
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <Fingerprint className="w-36 h-36 text-white" />
        </div>

        {/* Ledger Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <span className="text-[11px] font-mono-numbers font-bold text-emerald-400 tracking-wider uppercase block">
              AUTHORIZATION SLIP • GATE 01
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
              Permission to Inspect Cashflow
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              For: <span className="font-bold text-white">{profile.businessName}</span> (₹{(profile.requestedAmount / 100000).toFixed(1)}L Requested)
            </p>
          </div>

          <div className="px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block font-mono-numbers uppercase">STATUS STAMP</span>
            <span className="text-xs font-bold text-amber-400 flex items-center gap-1">
              <Stamp className="w-3 h-3" />
              <span>Pending Consent</span>
            </span>
          </div>
        </div>

        {/* What Will Be Read vs What Will NOT Happen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* What We Will Inspect */}
          <div className="p-4 rounded-xl bg-slate-850 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 font-bold">
              <Eye className="w-4 h-4 text-emerald-400" />
              <span>What CreditBridge Will Inspect</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Inflow &amp; Outflow Velocity:</strong> Monthly turnover movements over recorded 6-month cycles.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>UPI Digital Consistency:</strong> Proportion of verifiable QR/merchant receipts vs cash estimation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                <span><strong>Debt Servicing Buffer:</strong> Conservative free cashflow capacity to service loan EMI.</span>
              </li>
            </ul>
          </div>

          {/* Strict Guarantees */}
          <div className="p-4 rounded-xl bg-slate-850 bg-slate-900/90 border border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-slate-200 font-bold">
              <Lock className="w-4 h-4 text-indigo-400" />
              <span>Strict Privacy Protections</span>
            </div>
            <ul className="space-y-2 text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-black">•</span>
                <span><strong>Zero Bureau Penalty:</strong> Soft pre-check readiness, strictly zero CIBIL score hit.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-black">•</span>
                <span><strong>Zero External Submission:</strong> No bank receives this file until you complete Gate #2.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-indigo-400 font-black">•</span>
                <span><strong>Zero Broker Lead Sharing:</strong> Raw transaction records are never sold or shared with touts.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Assisted Mode Disclosures if active */}
        {profile.assistedByOperator && (
          <div className="p-3.5 bg-teal-950/60 border border-teal-800/80 rounded-xl text-xs text-teal-200 flex items-start gap-2.5">
            <FileCheck2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-teal-300">Assisted Operator Session Note: </span>
              {profile.operatorName ? `${profile.operatorName} is facilitating this intake. ` : 'An assisted operator is facilitating this intake. '}
              Under Tech4Bharat MSME guidelines, the borrower holds final individual authority. The helper cannot sign off without the borrower’s direct review.
            </div>
          </div>
        )}

        {/* Prototype Transparency Note */}
        <div className="p-3 bg-amber-950/50 border border-amber-800/70 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>Tech4Bharat Evaluation Mode:</strong> Evaluation uses consented sample/demo time-series data packaged with this profile. In production, this gate connects via the RBI Account Aggregator (AA) framework or DigiLocker.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-950/70 border border-rose-800 rounded-xl text-xs text-rose-300">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-800 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDeclineConsent}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors touch-target"
          >
            Decline &amp; Stop Session
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleGrantConsent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-50 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:gap-3 touch-target"
          >
            <span>{loading ? 'Evaluating Time-Series...' : 'Allow Cashflow Check (Consent Granted)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
