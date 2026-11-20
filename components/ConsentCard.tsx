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
  RotateCcw
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
        // default fallback
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

      // Call Route Handler POST /api/evaluate
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
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred while analyzing cashflow.');
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
      <div className="p-8 text-center text-slate-500 text-sm">
        Loading evaluation session...
      </div>
    );
  }

  // If user declined, show calm, clean stop screen
  if (declined) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl p-8 border border-slate-200 shadow-sm text-center space-y-6 animate-fade-in">
        <div className="w-16 h-16 mx-auto rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
          <XCircle className="w-8 h-8 text-slate-400" />
        </div>

        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Session Stopped by Applicant Decision
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed">
            You declined consent. In strict accordance with CreditBridge privacy principles, <strong>zero cashflow or transaction records were read, analyzed, or stored</strong> for <span className="font-semibold text-slate-800">{profile.businessName}</span>.
          </p>
        </div>

        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 text-left space-y-2">
          <div className="font-bold text-slate-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>Data Integrity Guarantee</span>
          </div>
          <p>
            No inquiry was sent to any bank, credit bureau, JanSamarth portal, or financial institution. You may restart or modify your intake parameters anytime.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => {
              setDeclined(false);
              router.push('/');
            }}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Return to Intake Screen</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Step Badge */}
      <div className="flex items-center justify-between">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 text-amber-900 text-xs font-semibold border border-amber-200">
          <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
          <span>Step 2 of 4: Explicit Consent Gate #1</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/')}
          className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Intake</span>
        </button>
      </div>

      {/* Main Consent Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
            Permission to Inspect Cashflow for {profile.businessName}
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-600">
            Before CreditBridge examines any transaction frequency or time-series inflow records, we require your informed authorization.
          </p>
        </div>

        {/* What Will Be Read vs What Will NOT Happen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* What We Will Inspect */}
          <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold">
              <Eye className="w-4 h-4 text-emerald-700" />
              <span>What We Will Inspect</span>
            </div>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Inflow & Outflow Velocity:</strong> Monthly turnover movements over the recorded 6-month period.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>UPI Digital Consistency:</strong> Proportion of verifiable QR/merchant receipts vs cash estimation.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Debt Servicing Buffer:</strong> Conservative estimate of free cashflow available for loan EMI.</span>
              </li>
            </ul>
          </div>

          {/* What Will NOT Happen */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs space-y-3">
            <div className="flex items-center gap-2 text-slate-800 font-bold">
              <Lock className="w-4 h-4 text-slate-600" />
              <span>Strict Privacy Protections</span>
            </div>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-black">•</span>
                <span><strong>Zero Formal Submission:</strong> No bank or portal receives this file until you complete Approval Gate #2.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-black">•</span>
                <span><strong>No Bureau Credit Hit:</strong> This is a soft pre-application readiness check, not a formal CIBIL pull.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 font-black">•</span>
                <span><strong>No Broker Lead Sharing:</strong> Raw transaction rows are never monetized, traded, or shared with middlemen.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Assisted Mode Disclosures if active */}
        {profile.assistedByOperator && (
          <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 flex items-start gap-2.5">
            <FileCheck2 className="w-4 h-4 text-teal-700 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold">Assisted Operator Session Note: </span>
              {profile.operatorName ? `${profile.operatorName} is facilitating this intake. ` : 'An assisted operator is assisting this intake. '}
              Under Tech4Bharat MSME guidelines, the borrower holds final individual authority. The helper cannot sign off without the borrower’s direct review.
            </div>
          </div>
        )}

        {/* Prototype Transparency Note */}
        <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-start gap-2">
          <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Tech4Bharat Evaluation Mode:</strong> Evaluation uses the consented sample/demo time-series data packaged with this profile. In production, this gate connects via the RBI Account Aggregator (AA) framework or live DigiLocker APIs.
          </div>
        </div>

        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700">
            {errorMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleDeclineConsent}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
          >
            Decline & Stop Session
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleGrantConsent}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-60 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:gap-3"
          >
            <span>{loading ? 'Evaluating Time-Series...' : 'Allow & Analyze Cashflow (Consent Granted)'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
