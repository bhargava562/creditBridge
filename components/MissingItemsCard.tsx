'use client';

import React from 'react';
import { MissingItem } from '@/lib/types';
import {
  CheckCircle2,
  ExternalLink,
  Clock,
  FileWarning,
  ShieldCheck
} from 'lucide-react';

interface MissingItemsCardProps {
  missingItems: MissingItem[];
}

export default function MissingItemsCard({ missingItems }: MissingItemsCardProps) {
  if (missingItems.length === 0) {
    return (
      <div className="bento-card p-6 bg-emerald-50/70 border-emerald-300 text-emerald-950 text-xs flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
        <div>
          <span className="font-bold text-emerald-900 text-sm">Complete Readiness Profile: </span>
          All primary statutory prerequisites (Udyam certificate, continuous operating time-series, proof of location) are detected and aligned.
        </div>
      </div>
    );
  }

  return (
    <div className="bento-card p-6 sm:p-8 space-y-5 animate-card-reveal">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#E2E6EE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-[#B45309]">
              <FileWarning className="w-5 h-5 text-[#B45309]" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Missing Items &amp; Verification Gaps Checklist ({missingItems.length})
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Complete these items before approaching a bank branch or JanSamarth to prevent file rejection.
              </p>
            </div>
          </div>
        </div>

        <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-[#FEF3C7] text-[#B45309] border border-amber-300 shadow-xs">
          Zero-Fee Self-Service Fixes
        </span>
      </div>

      <div className="space-y-3.5">
        {missingItems.map((item) => {
          const isCritical = item.severity === 'critical';
          const isNeeded = item.severity === 'verification_needed';

          return (
            <div
              key={item.id}
              className={`p-4 sm:p-5 rounded-2xl border text-xs space-y-3 transition-all ${
                isCritical || isNeeded
                  ? 'border-amber-200 bg-[#FEF3C7]/40'
                  : 'border-[#E2E6EE] bg-[#F5F5F7]'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-extrabold text-[#111827] text-sm sm:text-base">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                        isCritical || isNeeded
                          ? 'bg-[#FEF3C7] text-[#B45309] border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>
                  <div className="text-[12px] text-[#4B5563]">
                    Impacts: <span className="font-semibold text-slate-700">{item.affectedSchemes.join(', ')}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-[#4B5563] font-mono-numbers">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Est: {item.estimatedResolutionDays}</span>
                </div>
              </div>

              <p className="text-[#4B5563] text-sm leading-relaxed">
                {item.description}
              </p>

              {/* Actionable How-To Guide */}
              <div className="p-4 bg-white rounded-xl border border-[#E2E6EE] text-slate-800 space-y-2 shadow-xs">
                <span className="font-bold text-[11px] uppercase text-[#0F766E] tracking-wider block">
                  How to resolve 100% free without brokers or agents:
                </span>
                <p className="text-xs sm:text-[13px] leading-relaxed text-slate-700">
                  {item.howToResolve}
                </p>

                {item.freeGovtPortalUrl && (
                  <div className="pt-1.5">
                    <a
                      href={item.freeGovtPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0F766E] hover:underline touch-target"
                    >
                      <span>Open Official Portal: {item.freeGovtPortalUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] text-xs text-[#4B5563] flex items-center gap-2.5">
        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
        <span>
          <strong>Anti-Middleman Legal Shield:</strong> All central MSME registrations (Udyam, PMEGP e-portal, JanSamarth application) are 100% free by statutory mandate. Never pay touts, commissions, or unofficial fee-charging websites.
        </span>
      </div>
    </div>
  );
}
