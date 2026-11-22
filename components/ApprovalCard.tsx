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
  Award,
  Stamp,
  FileCheck2,
  Lock,
  Download
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
          setSelectedSchemeId(parsed.schemeCards[0].id);
        }
      } else {
        router.push('/');
      }
    } catch {
      router.push('/');
    }
  }, [router]);

  if (!evaluation) {
    return (
      <div className="py-20 text-center text-[#4B5563] text-sm">
        Loading authorization session...
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
Tech4Bharat 2026 • Problem Statement 3.2: Formal Credit & Schemes
=====================================================

APPLICANT PROFILE:
• Enterprise: ${applicant.businessName}
• Stage: ${applicant.stage.toUpperCase()} (${applicant.region.replace('_', ' ')})
• Requested Credit: ₹${applicant.requestedAmount.toLocaleString('en-IN')}
• Intake Mode: ${applicant.assistedByOperator ? 'Assisted Operator (' + (applicant.operatorNotes || 'Assisted') + ')' : 'Self-Service'}

SELECTED STATUTORY SCHEME:
• Scheme Name: ${selectedScheme?.schemeName}
• Category / Tier: ${selectedScheme?.tierOrCategory}
• Governing Ministry: ${selectedScheme?.governingMinistry}
• Eligible Ticket Bracket: ${selectedScheme?.eligibleAmountDisplay}
• Collateral: ${selectedScheme?.collateralRequired ? 'Collateral Required' : '100% Collateral-Free (Under Mandate)'}
• Guarantee/Subsidy: ${selectedScheme?.subsidyOrGuaranteeHighlights}

VERIFIED CASHFLOW VELOCITY (6-MONTH TIME-SERIES):
• Average Monthly Inflow: ₹${cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
• Monthly Operating Surplus: ₹${cashflow.averageNetCashflow.toLocaleString('en-IN')}
• UPI Digital Mix: ${cashflow.averageUpiConcentration}% QR Receipts
• Estimated Monthly EMI Buffer: ~₹${cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo
• Consistency Rating: ${cashflow.consistencyScore}/100

STATUTORY CITATIONS (FOR CREDIT OFFICER):
${selectedScheme?.ruleCitations.map(c => `• ${c.ruleTitle} (${c.circularRef}): "${c.clauseExcerpt}"`).join('\n')}

ACTION CHECKLIST TO TAKE TO BRANCH / JANSAMARTH:
${evaluation.missingItems.map(m => `[ ] ${m.title} — ${m.howToResolve}`).join('\n')}

DATA INTEGRITY & SIGN-OFF:
• Pre-application readiness confirmed by applicant on ${new Date().toLocaleDateString('en-IN')}.
• Evaluated via CreditBridge deterministic rule engine (Prototype Demo Mode).
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
    <div className="max-w-3xl mx-auto space-y-6 animate-card-reveal">
      {/* Top Breadcrumb */}
      <div className="flex items-center justify-between no-print">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-950 text-xs font-semibold border border-emerald-300">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
          <span>Step 4 of 4: Approval Gate #2 &amp; Final Readiness Summary</span>
        </div>
        <button
          type="button"
          onClick={() => router.push('/feed')}
          className="text-xs text-[#4B5563] hover:text-[#111827] inline-flex items-center gap-1 font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Feed</span>
        </button>
      </div>

      {!approvalConfirmed ? (
        /* Approval Gate #2: Tactile Authorization Slip */
        <div className="gate-slip p-6 sm:p-10 space-y-7 relative overflow-hidden">
          {/* Slip Header */}
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-5">
            <div>
              <span className="text-[11px] font-mono-numbers font-bold text-emerald-400 tracking-wider uppercase block">
                AUTHORIZATION SLIP • GATE 02
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
                Review &amp; Authorize Readiness
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                For: <span className="font-bold text-white">{applicant.businessName}</span> (₹{(applicant.requestedAmount / 100000).toFixed(1)}L Requested)
              </p>
            </div>

            <div className="px-3.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 text-right">
              <span className="text-[10px] text-slate-400 block font-mono-numbers uppercase">STATUS STAMP</span>
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Stamp className="w-3.5 h-3.5" />
                <span>Pending Sign-Off</span>
              </span>
            </div>
          </div>

          {/* Selected Scheme Summary */}
          <div className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
            <span className="text-[10px] font-mono-numbers font-bold uppercase tracking-wider text-slate-400">
              Selected Statutory Financing Path
            </span>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h3 className="text-lg font-bold text-white">
                  {selectedScheme?.schemeName}
                </h3>
                <p className="text-xs text-slate-300">
                  {selectedScheme?.tierOrCategory} • {selectedScheme?.governingMinistry}
                </p>
              </div>
              <span className="text-xs font-mono-numbers font-extrabold px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                ₹{applicant.requestedAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <div className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60 leading-relaxed">
              <strong className="text-white">Statutory Benefit: </strong>
              {selectedScheme?.subsidyOrGuaranteeHighlights}
            </div>
          </div>

          {/* Cashflow Velocity Check */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-numbers">Monthly Inflow</span>
              <span className="font-extrabold text-white text-sm sm:text-base font-mono-numbers block mt-0.5">
                ₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-numbers">Net Surplus</span>
              <span className="font-extrabold text-emerald-400 text-sm sm:text-base font-mono-numbers block mt-0.5">
                +₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 col-span-2 sm:col-span-1">
              <span className="text-slate-400 block text-[10px] uppercase font-mono-numbers">UPI Digital Trail</span>
              <span className="font-extrabold text-indigo-300 text-sm sm:text-base font-mono-numbers block mt-0.5">
                {cashflow.averageUpiConcentration}% QR Receipts
              </span>
            </div>
          </div>

          {/* Assisted Operator Notes if active */}
          {applicant.assistedByOperator && (
            <div className="p-3.5 bg-teal-950/60 border border-teal-800 rounded-xl text-xs text-teal-200 space-y-1">
              <span className="font-bold text-teal-300">Assisted Operator Sign-Off:</span>
              <p className="text-[12px] leading-relaxed">
                Ground notes recorded by operator: &ldquo;{applicant.operatorNotes || 'Physical unit confirmed active'}&rdquo;
              </p>
            </div>
          )}

          {/* Mandatory Checkbox Declaration Gate */}
          <div className="p-4 sm:p-5 bg-emerald-950/50 rounded-2xl border border-emerald-800/80 space-y-3">
            <label className="flex items-start gap-3.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={approved}
                onChange={(e) => setApproved(e.target.checked)}
                className="w-5 h-5 text-emerald-500 rounded border-slate-600 focus:ring-emerald-400 mt-0.5 shrink-0"
              />
              <span className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                <strong>Borrower Sign-Off Declaration:</strong> I, the authorized entrepreneur for <strong>{applicant.businessName}</strong>, confirm that I have reviewed the cashflow velocity signals, rule citations, and missing items checklist. I authorize generating my formal CreditBridge pre-application readiness summary.
              </span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => router.push('/feed')}
              className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-colors touch-target"
            >
              Modify Selection
            </button>

            <button
              type="button"
              onClick={handleConfirmApproval}
              disabled={!approved}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 disabled:opacity-40 text-white font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all hover:gap-3 touch-target"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm &amp; Generate Readiness Summary</span>
            </button>
          </div>
        </div>
      ) : (
        /* Post-Approval Confirmed View: Authoritative Readiness Certificate */
        <div className="space-y-6 animate-card-reveal">
          <div className="bento-card p-6 sm:p-10 print-shadow-none space-y-6">
            {/* Certificate Header */}
            <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b-2 border-[#111827]">
              <div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#1E3A8A] text-white flex items-center justify-center font-black text-xl">
                    CB
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-extrabold text-[#111827] tracking-tight">
                      CreditBridge Pre-Application Readiness Summary
                    </h2>
                    <p className="text-xs text-[#4B5563] font-medium">
                      Statutory Rule &amp; Cashflow Alignment Layer • Tech4Bharat 2026
                    </p>
                  </div>
                </div>
              </div>

              <div className="text-right text-xs">
                <span className="inline-flex items-center gap-1.5 text-emerald-900 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-lg shadow-xs">
                  <Award className="w-4 h-4 text-emerald-700" />
                  <span>Borrower Approved</span>
                </span>
                <p className="text-[11px] text-[#4B5563] font-mono-numbers mt-1">
                  Date: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>

            {/* Applicant Profile Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] text-xs">
              <div>
                <span className="text-[#4B5563] block text-[10px] uppercase font-bold">Enterprise</span>
                <span className="font-extrabold text-[#111827] block text-sm">{applicant.businessName}</span>
                <span className="text-[#4B5563] text-[11px] capitalize">{applicant.stage} unit</span>
              </div>
              <div>
                <span className="text-[#4B5563] block text-[10px] uppercase font-bold">Sector &amp; Region</span>
                <span className="font-bold text-slate-800 block capitalize">{applicant.sector.replace('_', ' ')}</span>
                <span className="text-[#4B5563] text-[11px] capitalize">{applicant.region.replace('_', ' ')}</span>
              </div>
              <div>
                <span className="text-[#4B5563] block text-[10px] uppercase font-bold">Requested Credit</span>
                <span className="font-extrabold text-emerald-800 block text-sm font-mono-numbers">
                  ₹{applicant.requestedAmount.toLocaleString('en-IN')}
                </span>
                <span className="text-slate-500 text-[11px]">Collateral-free track</span>
              </div>
              <div>
                <span className="text-[#4B5563] block text-[10px] uppercase font-bold">Intake Mode</span>
                <span className="font-bold text-slate-800 block">
                  {applicant.assistedByOperator ? 'Assisted Operator' : 'Self-Service'}
                </span>
                <span className="text-slate-500 text-[11px]">Consented at Gate #1</span>
              </div>
            </div>

            {/* Selected Scheme & Statutory Fit */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Recommended Statutory Scheme Fit
              </h3>
              <div className="p-5 rounded-2xl border border-emerald-300 bg-emerald-50/40 space-y-2.5 text-xs">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-extrabold text-[#111827] text-base sm:text-lg">
                    {selectedScheme?.schemeName}
                  </span>
                  <span className="font-bold text-emerald-900 bg-emerald-100 px-3 py-1 rounded-full text-xs">
                    {selectedScheme?.tierOrCategory}
                  </span>
                </div>
                <p className="text-slate-700 leading-relaxed text-sm">
                  {selectedScheme?.fitReason}
                </p>
                <div className="pt-2 text-xs text-slate-700 flex flex-wrap items-center justify-between border-t border-emerald-200/80 gap-2">
                  <span>Channel: <strong>{selectedScheme?.applicationChannel}</strong></span>
                  <span className="text-emerald-900 font-bold">{selectedScheme?.subsidyOrGuaranteeHighlights}</span>
                </div>
              </div>
            </div>

            {/* Statutory Citations */}
            <div className="space-y-2.5 text-xs">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Statutory Rule Citations (For Credit Officer / Branch Manager)
              </h3>
              <div className="space-y-2">
                {selectedScheme?.ruleCitations.map((cit, idx) => (
                  <div key={idx} className="p-3.5 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
                    <div className="font-bold text-[#111827] text-sm">
                      {cit.ruleTitle} ({cit.circularRef})
                    </div>
                    <div className="text-[11px] text-[#4B5563]">
                      Authority: {cit.authority}
                    </div>
                    <blockquote className="text-xs text-slate-700 italic border-l-2 border-emerald-600 pl-3 leading-relaxed">
                      &ldquo;{cit.clauseExcerpt}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Cashflow Velocity Summary */}
            <div className="space-y-2.5 text-xs">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Verified Time-Series Cashflow Velocity
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono-numbers">
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE]">
                  <span className="text-[#4B5563] text-[10px] block font-sans">Avg Monthly Inflow</span>
                  <span className="font-bold text-[#111827] text-sm">₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE]">
                  <span className="text-[#4B5563] text-[10px] block font-sans">Monthly Surplus</span>
                  <span className="font-bold text-emerald-700 text-sm">+₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}</span>
                </div>
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE]">
                  <span className="text-[#4B5563] text-[10px] block font-sans">UPI Concentration</span>
                  <span className="font-bold text-indigo-900 text-sm">{cashflow.averageUpiConcentration}% QR</span>
                </div>
                <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE]">
                  <span className="text-[#4B5563] text-[10px] block font-sans">EMI Service Buffer</span>
                  <span className="font-bold text-emerald-800 text-sm">~₹{cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo</span>
                </div>
              </div>
            </div>

            {/* Action Checklist for Bank Visit */}
            <div className="space-y-2.5 text-xs">
              <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
                Action Checklist to Take to Branch / JanSamarth
              </h3>
              <div className="space-y-2">
                {evaluation.missingItems.map((item, idx) => (
                  <div key={idx} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200 text-slate-800 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#111827]">{item.title}</span>
                      <span className="text-[10px] font-bold text-[#B45309]">{item.badgeLabel}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.howToResolve}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Signatures & Disclosures */}
            <div className="pt-6 border-t border-[#E2E6EE] grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-[#4B5563]">
              <div>
                <p className="font-bold text-[#111827] mb-1">Applicant Consent &amp; Approval Record</p>
                <p>Digital Sign-Off: Confirmed by {applicant.businessName}</p>
                <p>Status: Pre-Application Ready for Branch Appraisal</p>
              </div>
              <div className="sm:text-right">
                <p className="font-bold text-[#111827] mb-1">Tech4Bharat 2026 Disclosure</p>
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
              className="inline-flex items-center gap-1.5 px-4 py-3 rounded-xl border border-[#E2E6EE] hover:bg-slate-100 text-[#111827] font-semibold text-xs touch-target transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Start New Evaluation</span>
            </button>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleCopySummary}
                className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-900 hover:bg-black text-white font-semibold text-xs touch-target transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Summary Copied!' : 'Copy Summary Text'}</span>
              </button>

              <button
                type="button"
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F766E] hover:bg-teal-800 text-white font-bold text-xs shadow-md shadow-teal-950/20 touch-target transition-colors"
              >
                <Printer className="w-4 h-4" />
                <span>Print / Save PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
