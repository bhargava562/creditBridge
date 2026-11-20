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
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 text-xs flex items-center gap-3">
        <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
        <div>
          <span className="font-bold text-emerald-800">Complete Readiness Profile: </span>
          All primary statutory prerequisites (Udyam, operating time-series, proof of location) are detected and aligned.
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5 animate-fade-in">
      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <FileWarning className="w-4 h-4 text-amber-700" />
            </span>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Missing & Verification Items Checklist ({missingItems.length})
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Complete these items before approaching the bank or JanSamarth to avoid delays or file rejection.
          </p>
        </div>

        <span className="text-[11px] font-semibold px-2.5 py-1 rounded-md bg-amber-50 text-amber-900 border border-amber-200">
          Zero-Fee Self-Service Fixes
        </span>
      </div>

      <div className="space-y-3">
        {missingItems.map((item) => {
          const isCritical = item.severity === 'critical';
          const isNeeded = item.severity === 'verification_needed';

          return (
            <div
              key={item.id}
              className={`p-4 rounded-xl border text-xs space-y-2.5 transition-all ${
                isCritical || isNeeded
                  ? 'border-amber-200 bg-amber-50/30'
                  : 'border-slate-200 bg-slate-50/50'
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 text-sm">
                      {item.title}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isCritical || isNeeded
                          ? 'bg-amber-100 text-amber-800 border-amber-300'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}
                    >
                      {item.badgeLabel}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Impacts: {item.affectedSchemes.join(', ')}
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[11px] text-slate-500 font-medium">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Est: {item.estimatedResolutionDays}</span>
                </div>
              </div>

              <p className="text-slate-600 leading-relaxed text-xs">
                {item.description}
              </p>

              {/* Actionable How-To Guide */}
              <div className="p-3 bg-white rounded-lg border border-slate-200/90 text-slate-700 space-y-1.5">
                <span className="font-bold text-[10px] uppercase text-emerald-800 block">
                  How to resolve without agents or fees:
                </span>
                <p className="text-[11px] leading-relaxed">
                  {item.howToResolve}
                </p>

                {item.freeGovtPortalUrl && (
                  <div className="pt-1">
                    <a
                      href={item.freeGovtPortalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-800 underline"
                    >
                      <span>Open Official Portal: {item.freeGovtPortalUrl.replace('https://', '')}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
        <span>
          <strong>Anti-Middleman Shield:</strong> All central MSME registrations (Udyam, PMEGP portal, JanSamarth login) are 100% free by law. Never pay touts or unofficial fee sites.
        </span>
      </div>
    </div>
  );
}
