'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EvaluationResponse, SchemeCardItem } from '@/lib/types';
import {
  ShieldCheck,
  CheckCircle2,
  Printer,
  Copy,
  Check,
  ArrowLeft,
  RotateCcw,
  Award
} from 'lucide-react';

export default function ApprovalCard() {
  const router = useRouter();

  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const [selectedSchemeId, setSelectedSchemeId] = useState<string>('');
  const [approved, setApproved] = useState<boolean>(false);
  const [approvalConfirmed, setApprovalConfirmed] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    try {
      const evalStr = sessionStorage.getItem('creditbridge_evaluation_result');
      const schemeId = sessionStorage.getItem('creditbridge_selected_scheme');

      if (evalStr) {
        const parsed: EvaluationResponse = JSON.parse(evalStr);
        setEvaluation(parsed);
        if (schemeId) {
          setSelectedSchemeId(schemeId);
        } else if (parsed.schemeCards && parsed.schemeCards.length > 0) {
          // default to the top likely fit
          setSelectedSchemeId(parsed.schemeCards[0].id);
        }
      } else {
        // Fallback for direct URL visit
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router]);

  if (!evaluation) {
    return (
      <div className="p-8 text-center text-slate-500 text-sm">
        Loading evaluation session...
      </div>
    );
  }

  const selectedScheme: SchemeCardItem | undefined = evaluation.schemeCards.find(
    s => s.id === selectedSchemeId
  ) || evaluation.schemeCards[0];

  const applicant = evaluation.applicant;
  const cashflow = evaluation.cashflow;

  const handleConfirmApproval = () => {
    if (!approved) {
      alert('Please check the confirmation box to authorize your readiness summary.');
      return;
    }
    setApprovalConfirmed(true);
    sessionStorage.setItem('creditbridge_user_approved', 'true');
  };

  const generateSummaryText = () => {
    return `=====================================================
CREDITBRIDGE — MSME PRE-APPLICATION READINESS SUMMARY
Tech4Bharat 2026 • Problem Statement 3.2
=====================================================

APPLICANT DETAILS:
• Enterprise: ${applicant.businessName}
• Stage: ${applicant.stage.toUpperCase()} (${applicant.region.replace('_', ' ')})
• Requested Credit: ₹${applicant.requestedAmount.toLocaleString('en-IN')}
• Assisted Session: ${applicant.assistedByOperator ? 'Yes (' + (applicant.operatorNotes || 'Assisted') + ')' : 'Self-Service'}

SELECTED STATUTORY SCHEME:
• Scheme Name: ${selectedScheme?.schemeName}
• Ministry: ${selectedScheme?.governingMinistry}
• Eligible Bracket: ${selectedScheme?.eligibleAmountDisplay}
• Collateral: ${selectedScheme?.collateralRequired ? 'Collateral Required' : 'Collateral-Free (Under Mandate)'}
• Guarantee/Subsidy: ${selectedScheme?.subsidyOrGuaranteeHighlights}

CASHFLOW VELOCITY & DEBT SERVICE BUFFER:
• Average Monthly Inflow: ₹${cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
• Monthly Operating Surplus: ₹${cashflow.averageNetCashflow.toLocaleString('en-IN')}
• UPI Digital Trail Share: ${cashflow.averageUpiConcentration}%
• Estimated Monthly EMI Buffer: ~₹${cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo
• Consistency Score: ${cashflow.consistencyScore}/100

STATUTORY RULE CITATIONS:
${selectedScheme?.ruleCitations.map(c => `• ${c.ruleTitle} (${c.circularRef}): "${c.clauseExcerpt}"`).join('\n')}

REMAINING CHECKLIST ITEMS TO CARRY:
${evaluation.missingItems.map(m => `[ ] ${m.title} — ${m.howToResolve}`).join('\n')}

AUTHORIZATION & DATA DISCLOSURE:
• Pre-application readiness confirmed by applicant on ${new Date().toLocaleDateString('en-IN')}.
• Evaluated via CreditBridge deterministic rule engine. Prototype demo mode.
=====================================================`;
  };

  const handleCopySummary = () => {
    const text = generateSummaryText();
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Step 4 of 4: Approval Gate #2 & Final Readiness Summary</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/feed')}
          className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Feed</span>
        </button>
      </div>

      {!approvalConfirmed ? (
        /* Approval Confirmation Form */
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900">
              Review & Authorize Pre-Application Readiness
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600">
              Approval Gate #2 ensures that you, the entrepreneur, retain full ownership of the chosen financing path before any summary document is finalized.
            </p>
          </div>

          {/* Selected Scheme Summary Card */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Selected Financing Path
            </span>
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {selectedScheme?.schemeName}
                </h3>
                <p className="text-xs text-slate-600">
                  {selectedScheme?.tierOrCategory} • {selectedScheme?.governingMinistry}
                </p>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                ₹{applicant.requestedAmount.toLocaleString('en-IN')} Requested
              </span>
            </div>

            <div className="text-xs text-slate-700 bg-white p-3 rounded-lg border border-slate-200">
              <strong>Statutory Benefit: </strong>
              {selectedScheme?.subsidyOrGuaranteeHighlights}
            </div>
          </div>

          {/* Cashflow Velocity Check */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Monthly Inflow</span>
              <span className="font-extrabold text-slate-800 text-sm">
                ₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <span className="text-slate-400 block text-[10px] uppercase">Net Surplus</span>
              <span className="font-extrabold text-emerald-700 text-sm">
                +₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase">UPI Digital Trail</span>
              <span className="font-extrabold text-teal-700 text-sm">
                {cashflow.averageUpiConcentration}% QR Receipts
              </span>
            </div>
          </div>

          {/* Assisted Operator Transparency if active */}
          {applicant.assistedByOperator && (
            <div className="p-3.5 bg-teal-50 border border-teal-200 rounded-xl text-xs text-teal-900 space-y-1">
              <span className="font-bold">Assisted Operator Sign-Off:</span>
              <p className="text-[11px] leading-relaxed">
                Ground notes recorded by operator: "{applicant.operatorNotes || 'Physical unit confirmed active'}"
              </p>
            </div>
          )}

          {/* Mandatory Checkbox Gate */}
          <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="w-5 h-5 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500 mt-0.5"
              />
              <span className="text-xs text-slate-800 leading-relaxed">
                <strong>Borrower Sign-Off Declaration:</strong> I, the authorized applicant for <strong>{applicant.businessName}</strong>, confirm that I have reviewed the cashflow velocity signals, rule citations, and missing items checklist. I authorize generating my formal CreditBridge pre-application readiness summary.
              </span>
            </label>
          </div>

          {/* Action Button */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/feed')}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              Modify Selection
            </button>

            <button
              type="button"
              onClick={handleConfirmApproval}
              disabled={!approved}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:gap-3"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Generate Readiness Summary</span>
            </button>
          </div>
        </div>
      ) : (
        /* Confirmed View: Authorized Readiness Certificate & Summary */
        <div className="space-y-6">
          {/* Printable / Authoritative Document Container */}
          <div className="bg-white rounded-2xl p-6 sm:p-10 border border-slate-300 shadow-sm print-shadow-none space-y-6">
            {/* Header / Seal */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-slate-800">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-black text-lg">
                    CB
                  </div>
                  <div>
                    <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">
                      CreditBridge Pre-Application Readiness Summary
                    </h2>
                    <p className="text-xs text-slate-500 font-medium">
                      Statutory Rule & Cashflow Alignment Layer • Tech4Bharat 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-2.5 py-1 rounded-md">
                  <Award className="w-3.5 h-3.5" />
                  <span>Borrower Approved</span>
                </span>
                <p className="text-[10px] text-slate-400 mt-1">
                  Generated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Applicant Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Enterprise</span>
                <span className="font-bold text-slate-900 block text-sm">{applicant.businessName}</span>
                <span className="text-slate-500 text-[11px] capitalize">{applicant.stage} unit</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Sector & Region</span>
                <span className="font-bold text-slate-800 block capitalize">{applicant.sector.replace('_', ' ')}</span>
                <span className="text-slate-500 text-[11px] capitalize">{applicant.region.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Requested Credit</span>
                <span className="font-extrabold text-emerald-700 block text-sm">
                  ₹{applicant.requestedAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 text-[11px]">Collateral-free track</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Intake Mode</span>
                <span className="font-bold text-slate-800 block">
                  {applicant.assistedByOperator ? 'Assisted Operator' : 'Self-Service'}
                </span>
                <span className="text-slate-500 text-[11px]">Verified consent</span>
              </div>
            </div>

            {/* Selected Scheme & Statutory Grounding */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Recommended Statutory Scheme Fit
              </h3>
              <div className="p-4 rounded-xl border border-emerald-200 bg-emerald-50/30 space-y-2 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-slate-900 text-base">
                    {selectedScheme?.schemeName}
                  </span>
                  <span className="font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full text-[11px]">
                    {selectedScheme?.tierOrCategory}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  {selectedScheme?.fitReason}
                </p>
                <div className="pt-2 text-[11px] text-slate-600 flex items-center justify-between border-t border-emerald-200/60">
                  <span>Channel: <strong>{selectedScheme?.applicationChannel}</strong></span>
                  <span className="text-emerald-800 font-semibold">{selectedScheme?.subsidyOrGuaranteeHighlights}</span>
                </div>
              </div>
            </div>

            {/* Statutory Citations */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Statutory Rule Citations (For Credit Officer / Branch Manager)
              </h3>
              <div className="space-y-2">
                {selectedScheme?.ruleCitations.map((cit, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-lg border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">
                      {cit.ruleTitle} ({cit.circularRef})
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Authority: {cit.authority}
                    </div>
                    <blockquote className="text-[11px] text-slate-700 italic border-l-2 border-emerald-500 pl-2">
                      "{cit.clauseExcerpt}"
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Cashflow Velocity Summary */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Verified Time-Series Cashflow Velocity
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Avg Monthly Inflow</span>
                  <span className="font-bold text-slate-900">₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">Monthly Surplus</span>
                  <span className="font-bold text-emerald-700">+₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">UPI Concentration</span>
                  <span className="font-bold text-teal-700">{cashflow.averageUpiConcentration}% QR</span>
                </div>
                <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-slate-400 text-[10px] block">EMI Service Buffer</span>
                  <span className="font-bold text-emerald-800">~₹{cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            {/* Remaining Checklist for Submission */}
            <div className="space-y-2 text-xs">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Action Checklist to Take to Branch / JanSamarth
              </h3>
              <div className="space-y-1.5">
                {evaluation.missingItems.map((item, idx) => (
                  <div key={idx} className="p-2.5 bg-amber-50/50 rounded-lg border border-amber-200 text-slate-700 space-y-0.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{item.title}</span>
                      <span className="text-[10px] font-semibold text-amber-800">{item.badgeLabel}</span>
                    </div>
                    <p className="text-[11px] text-slate-600">{item.howToResolve}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signature & Disclaimer Block */}
            <div className="pt-6 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-6 text-[11px] text-slate-500">
              <div>
                <p className="font-bold text-slate-700 mb-1">Applicant Consent & Approval Record</p>
                <p>Digital Sign-Off: Confirmed by {applicant.businessName}</p>
                <p>Status: Pre-Application Ready for Branch Appraisal</p>
              </div>
              <div className="sm:text-right">
                <p className="font-bold text-slate-700 mb-1">Tech4Bharat 2026 Disclosure</p>
                <p>Rule-Cited Pre-Application Layer • Not a Final Bank Sanction</p>
                <p>Self-contained Next.js Deterministic Engine</p>
              </div>
            </div>
          </div>

          {/* Action Buttons (Print, Copy, Restart) */}
          <div className="flex flex-wrap items-center justify-between gap-3 no-print">
            <button
              type="button"
              onClick={() => {
                sessionStorage.clear();
                router.push('/');
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold text-xs transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Evaluation</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-semibold text-xs transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Summary Copied!' : 'Copy Summary Text'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs shadow-md shadow-emerald-700/20 transition-colors"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
