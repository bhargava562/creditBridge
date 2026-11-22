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
  Check,
  Award,
  Landmark
} from 'lucide-react';

interface SchemeCardProps {
  scheme: SchemeCardItem;
  isSelected: boolean;
  onSelect: (schemeId: string) => void;
  isTopRecommendation?: boolean;
}

export default function SchemeCard({
  scheme,
  isSelected,
  onSelect,
  isTopRecommendation = false
}: SchemeCardProps) {
  const [showCitations, setShowCitations] = useState<boolean>(false);

  // Status Styling
  const badgeConfig = {
    likely_fit: {
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: <CheckCircle2 className="w-4 h-4 text-emerald-700" />,
      border: isSelected
        ? 'border-[#0F766E] ring-2 ring-[#0F766E]/40 shadow-md'
        : isTopRecommendation
        ? 'border-emerald-300/90 shadow-sm'
        : 'border-[#E2E6EE]',
      headerBg: isTopRecommendation ? 'bg-gradient-to-r from-emerald-50/70 to-teal-50/50' : 'bg-emerald-50/30'
    },
    partial_fit: {
      badgeBg: 'bg-[#FEF3C7] text-[#B45309] border-amber-300',
      icon: <AlertCircle className="w-4 h-4 text-[#B45309]" />,
      border: isSelected ? 'border-[#B45309] ring-2 ring-amber-400/40' : 'border-amber-200/80',
      headerBg: 'bg-amber-50/40'
    },
    not_a_fit: {
      badgeBg: 'bg-slate-100 text-slate-700 border-slate-300',
      icon: <XCircle className="w-4 h-4 text-slate-500" />,
      border: 'border-[#E2E6EE] opacity-80',
      headerBg: 'bg-slate-50'
    }
  }[scheme.fitStatus];

  return (
    <div
      className={`bento-card overflow-hidden flex flex-col justify-between transition-all ${badgeConfig.border} ${
        isSelected ? 'bg-white shadow-lg' : ''
      }`}
    >
      <div>
        {/* Header with Title & Fit Status Badge */}
        <div className={`p-5 sm:p-6 border-b border-[#E2E6EE] ${badgeConfig.headerBg}`}>
          <div className="flex flex-wrap items-start justify-between gap-2 mb-2.5">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold text-[#4B5563] uppercase tracking-wider block">
                  {scheme.tierOrCategory} • {scheme.governingMinistry}
                </span>
                {isTopRecommendation && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1E3A8A] text-white text-[10px] font-bold shadow-xs">
                    <Award className="w-3 h-3 text-emerald-300" />
                    <span>Top Match</span>
                  </span>
                )}
              </div>
              <h3 className="text-lg sm:text-xl font-extrabold text-[#111827] mt-1">
                {scheme.schemeName}
              </h3>
            </div>

            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${badgeConfig.badgeBg} shadow-xs shrink-0`}
            >
              {badgeConfig.icon}
              <span>{scheme.fitBadgeText}</span>
            </span>
          </div>

          <p className="text-sm font-semibold text-[#111827] leading-snug">
            {scheme.fitHeadline}
          </p>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-4 text-xs">
          {/* Fit Reason */}
          <div className="space-y-1">
            <span className="font-bold text-[#111827] uppercase tracking-wider text-[11px]">
              Why this recommendation:
            </span>
            <p className="text-[#4B5563] text-sm leading-relaxed">
              {scheme.fitReason}
            </p>
          </div>

          {/* Why Not / Rule Check Reason if applicable */}
          {scheme.whyNotReason && (
            <div className="p-3.5 bg-[#FEF3C7]/80 rounded-xl border border-amber-300/80 text-[#B45309] space-y-1">
              <span className="font-bold flex items-center gap-1.5 text-amber-900 text-xs">
                <AlertCircle className="w-4 h-4 text-[#B45309]" />
                <span>Statutory Constraint / Wrong-Fit Guardrail:</span>
              </span>
              <p className="text-[12px] leading-relaxed text-amber-950 font-medium">
                {scheme.whyNotReason}
              </p>
            </div>
          )}

          {/* Scheme Highlights (Ticket Size & Guarantee / Channel) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
              <span className="text-[10px] text-[#4B5563] font-bold block uppercase tracking-wide">
                Eligible Ticket Size
              </span>
              <span className="font-extrabold text-[#111827] text-sm font-mono-numbers block">
                {scheme.eligibleAmountDisplay}
              </span>
              <span className="text-[11px] text-emerald-800 font-semibold block">
                {scheme.collateralRequired ? 'Collateral Required' : '✓ 100% Collateral-Free'}
              </span>
            </div>

            <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
              <span className="text-[10px] text-[#4B5563] font-bold block uppercase tracking-wide">
                Subsidy or Guarantee
              </span>
              <span className="font-bold text-[#111827] block text-xs line-clamp-1">
                {scheme.subsidyOrGuaranteeHighlights.split('.')[0]}
              </span>
              <span className="text-[11px] text-[#4B5563] block font-medium">
                {scheme.janSamarthMapped ? '✓ JanSamarth Direct Mapped' : 'Bank Branch Channel'}
              </span>
            </div>
          </div>

          {/* Expandable Statutory Source Citations Drawer */}
          <div className="pt-2 border-t border-[#E2E6EE]">
            <button
              type="button"
              onClick={() => setShowCitations(!showCitations)}
              className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1E3A8A] hover:text-blue-900 transition-colors py-2 touch-target"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#0F766E]" />
                <span>Statutory Source Citations &amp; Circular Excerpts ({scheme.ruleCitations.length})</span>
              </span>
              {showCitations ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            {showCitations && (
              <div className="mt-2 space-y-2.5 p-4 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] animate-card-reveal text-xs">
                {scheme.ruleCitations.map((cit, idx) => (
                  <div key={idx} className="space-y-1.5 pb-2.5 border-b border-[#E2E6EE] last:border-b-0 last:pb-0">
                    <div className="flex items-start justify-between gap-2">
                      <span className="font-bold text-[#111827]">{cit.ruleTitle}</span>
                      <a
                        href={cit.officialSourceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#0F766E] hover:underline font-bold inline-flex items-center gap-1 text-[11px] shrink-0"
                      >
                        <span>Official Portal</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="text-[11px] text-[#4B5563]">
                      Authority: {cit.authority} • Ref: {cit.circularRef}
                    </div>
                    <blockquote className="text-[12px] text-slate-800 italic border-l-2 border-[#0F766E] pl-2.5 mt-1 leading-relaxed">
                      &ldquo;{cit.clauseExcerpt}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Select Button Footer */}
      <div className="p-4 sm:p-5 bg-[#F5F5F7] border-t border-[#E2E6EE] flex items-center justify-between gap-3">
        <span className="text-xs text-[#4B5563] font-medium">
          {scheme.fitStatus === 'not_a_fit' ? 'Rule mismatch' : 'Ready for authorization slip'}
        </span>

        <button
          type="button"
          onClick={() => onSelect(scheme.id)}
          className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 touch-target ${
            isSelected
              ? 'bg-[#1E3A8A] text-white shadow-md'
              : 'bg-white border border-[#E2E6EE] hover:border-[#1E3A8A] hover:bg-indigo-50/40 text-[#111827]'
          }`}
        >
          {isSelected ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Selected for Sign-Off</span>
            </>
          ) : (
            <span>Choose This Scheme</span>
          )}
        </button>
      </div>
    </div>
  );
}
