'use client';

import React, { useState } from 'react';
import { SchemeCardItem } from '@/lib/types';
import {
  CheckCircle2,
  AlertCircle,
  XCircle,
  ShieldCheck,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Check
} from 'lucide-react';

interface SchemeCardProps {
  scheme: SchemeCardItem;
  isSelected: boolean;
  onSelect: (schemeId: string) => void;
}

export default function SchemeCard({ scheme, isSelected, onSelect }: SchemeCardProps) {
  const [showCitations, setShowCitations] = useState<boolean>(false);

  // Status Styling
  const badgeConfig = {
    likely_fit: {
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
      border: isSelected ? 'border-emerald-600 ring-2 ring-emerald-500/40' : 'border-emerald-200/80',
      headerBg: 'bg-emerald-50/50'
    },
    partial_fit: {
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: <AlertCircle className="w-4 h-4 text-amber-700" />,
      border: isSelected ? 'border-amber-600 ring-2 ring-amber-500/40' : 'border-amber-200/80',
      headerBg: 'bg-amber-50/40'
    },
    not_a_fit: {
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: <XCircle className="w-4 h-4 text-slate-500" />,
      border: 'border-slate-200 opacity-80',
      headerBg: 'bg-slate-50'
    }
  }[scheme.fitStatus];

  return (
    <div
      className={`rounded-2xl border transition-all bg-white shadow-xs overflow-hidden flex flex-col justify-between ${badgeConfig.border}`}
    >
      <div>
        {/* Header with Title & Fit Status Badge */}
        <div className={`p-5 border-b border-slate-100 ${badgeConfig.headerBg}`}>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                {scheme.tierOrCategory} • {scheme.governingMinistry}
              </span>
              <h3 className="text-base sm:text-lg font-extrabold text-slate-900">
                {scheme.schemeName}
              </h3>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeConfig.badgeBg}`}
            >
              {badgeConfig.icon}
              <span>{scheme.fitBadgeText}</span>
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-800 leading-snug">
            {scheme.fitHeadline}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 text-xs">
          {/* Fit Reason */}
          <div className="space-y-1">
            <span className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">
              Why this recommendation:
            </span>
            <p className="text-slate-600 leading-relaxed">
              {scheme.fitReason}
            </p>
          </div>

          {/* Why Not Reason if applicable */}
          {scheme.whyNotReason && (
            <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-amber-900 space-y-1">
              <span className="font-bold flex items-center gap-1 text-amber-800">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Statutory Constraint / Wrong-Fit Guardrail:</span>
              </span>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                {scheme.whyNotReason}
              </p>
            </div>
          )}

          {/* Scheme Highlights (Guarantee / Subsidy / Channel) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Eligible Ticket Size
              </span>
              <span className="font-bold text-slate-800 block">
                {scheme.eligibleAmountDisplay}
              </span>
              <span className="text-[10px] text-emerald-700 font-medium">
                {scheme.collateralRequired ? 'Collateral Required' : '✓ 100% Collateral-Free'}
              </span>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-100 space-y-0.5">
              <span className="text-[10px] text-slate-400 font-semibold block uppercase">
                Subsidy or Guarantee
              </span>
              <span className="font-bold text-slate-800 block line-clamp-1">
                {scheme.subsidyOrGuaranteeHighlights.split('.')[0]}
              </span>
              <span className="text-[10px] text-slate-500">
                {scheme.janSamarthMapped ? '✓ JanSamarth Direct Mapped' : 'Bank Branch Channel'}
              </span>
            </div>
          </div>

          {/* Expandable Statutory Source Citations */}
          <div className="pt-2 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setShowCitations(!showCitations)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-slate-700 hover:text-emerald-700 transition-colors py-1"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Statutory Source Citations & Circular Excerpts ({scheme.ruleCitations.length})</span>
              </span>
              {showCitations ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {showCitations && (
              <div className="mt-2.5 space-y-2 p-3 bg-slate-50 rounded-xl border border-slate-200 animate-fade-in text-xs">
                {scheme.ruleCitations.map((cit, idx) => (
                  <div key={idx} className="space-y-1 pb-2 border-b border-slate-200/80 last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-slate-800">{cit.ruleTitle}</span>
                      <a
                        href={cit.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-0.5 text-[10px] shrink-0"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Authority: {cit.authority} • Ref: {cit.circularRef}
                    </div>
                    <blockquote className="text-[11px] text-slate-700 italic border-l-2 border-emerald-500 pl-2 mt-1">
                      "{cit.clauseExcerpt}"
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Select Button Footer */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-3">
        <span className="text-[11px] text-slate-500">
          {scheme.fitStatus === 'not_a_fit' ? 'Warning: Rule mismatch' : 'Ready for approval'}
        </span>

        <button
          type="button"
          onClick={() => onSelect(scheme.id)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            isSelected
              ? 'bg-emerald-700 text-white shadow-xs'
              : 'bg-white border border-slate-300 hover:border-emerald-600 hover:bg-emerald-50/50 text-slate-800'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>Selected for Action</span>
            </>
          ) : (
            <span>Choose This Scheme</span>
          )}
        </button>
      </div>
    </div>
  );
}
