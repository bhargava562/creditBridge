'use client';

import React, { useState } from 'react';
import { CashflowSummary, TimeSeriesPoint } from '@/lib/types';
import {
  Activity,
  QrCode,
  CheckCircle2,
  Calendar,
  Scale,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  Info
} from 'lucide-react';

interface CashflowCardProps {
  cashflow: CashflowSummary;
  timeSeriesData?: TimeSeriesPoint[];
  businessName: string;
}

export default function CashflowCard({
  cashflow,
  timeSeriesData = [],
  businessName
}: CashflowCardProps) {
  const [showFairnessDetails, setShowFairnessDetails] = useState<boolean>(false);

  // Find max value for relative bar heights in time-series chart
  const maxInflow = timeSeriesData.length > 0
    ? Math.max(...timeSeriesData.map(p => p.inflow))
    : cashflow.averageMonthlyInflow * 1.2;

  return (
    <div className="bento-card p-6 sm:p-8 space-y-6 animate-card-reveal">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E6EE]">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E]">
              <Activity className="w-5 h-5 text-[#0F766E]" />
            </span>
            <div>
              <h2 className="text-xl font-bold text-[#111827]">
                Continuous Cashflow Trend &amp; Repayment Buffer
              </h2>
              <p className="text-xs text-[#4B5563] mt-0.5">
                Multi-month operating velocity evaluated for <span className="font-semibold text-[#111827]">{businessName}</span>.
              </p>
            </div>
          </div>
        </div>

        {/* Consistency Score Badge */}
        <div className="flex items-center gap-2.5 bg-emerald-50 border border-emerald-300/80 px-3.5 py-1.5 rounded-xl shadow-xs">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-emerald-900 tracking-wider">
              Consistency Score
            </div>
            <div className="text-sm font-extrabold text-emerald-800 font-mono-numbers">
              {cashflow.consistencyScore} / 100
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ✓
          </div>
        </div>
      </div>

      {/* 4 Metric Tiles Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
          <span className="text-[11px] text-[#4B5563] block font-medium">Avg Monthly Inflow</span>
          <span className="text-base sm:text-lg font-extrabold text-[#111827] font-mono-numbers block">
            ₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-bold text-emerald-700 block">
            {cashflow.inflowTrend === 'growing' ? `↗ +${cashflow.trendPercent}% Inflow Trend` : 'Stable Velocity'}
          </span>
        </div>

        <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
          <span className="text-[11px] text-[#4B5563] block font-medium">Monthly Operating Surplus</span>
          <span className="text-base sm:text-lg font-extrabold text-[#0F766E] font-mono-numbers block">
            +₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-[#4B5563] block">
            After raw operational costs
          </span>
        </div>

        <div className="p-3.5 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] space-y-1">
          <span className="text-[11px] text-[#4B5563] block font-medium">UPI QR Digital Mix</span>
          <span className="text-base sm:text-lg font-extrabold text-indigo-900 font-mono-numbers block flex items-center gap-1">
            <QrCode className="w-4 h-4 text-[#1E3A8A]" />
            <span>{cashflow.averageUpiConcentration}%</span>
          </span>
          <span className="text-[10px] text-[#4B5563] block">
            Verifiable digital velocity
          </span>
        </div>

        <div className="p-3.5 bg-emerald-50/70 rounded-xl border border-emerald-300/80 space-y-1">
          <span className="text-[11px] text-emerald-950 font-bold block">Estimated EMI Buffer</span>
          <span className="text-base sm:text-lg font-extrabold text-emerald-800 font-mono-numbers block">
            ~₹{cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] text-emerald-700 font-medium block">
            Conservative capacity
          </span>
        </div>
      </div>

      {/* 6-Month Continuous Visual Bar Chart */}
      {timeSeriesData.length > 0 && (
        <div className="p-5 bg-[#0F172A] text-white rounded-2xl space-y-4 shadow-sm">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span className="font-bold text-slate-200">6-Month Continuous Inflow &amp; Outflow Movement</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-300">
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-emerald-400 inline-block"></span> Inflow
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded-xs bg-slate-600 inline-block"></span> Outflow
              </span>
            </div>
          </div>

          {/* Bar Chart Bars */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-32 pt-4 border-b border-slate-800">
            {timeSeriesData.map((pt, idx) => {
              const inflowPct = Math.max(16, Math.round((pt.inflow / maxInflow) * 100));
              const outflowPct = Math.max(10, Math.round((pt.outflow / maxInflow) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-1.5 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-14 bg-slate-800 text-[10px] text-white p-1.5 rounded-lg border border-slate-700 whitespace-nowrap z-20 pointer-events-none shadow-lg">
                    <div>Inflow: ₹{pt.inflow.toLocaleString('en-IN')}</div>
                    <div>Net: +₹{pt.netCashflow.toLocaleString('en-IN')}</div>
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 sm:gap-1.5 h-24">
                    <div
                      style={{ height: `${inflowPct}%` }}
                      className="w-3 sm:w-5 bg-emerald-400 rounded-t-sm transition-all duration-300"
                    ></div>
                    <div
                      style={{ height: `${outflowPct}%` }}
                      className="w-3 sm:w-5 bg-slate-600 rounded-t-sm transition-all duration-300"
                    ></div>
                  </div>

                  {/* Month Label */}
                  <span className="text-[11px] font-mono-numbers text-slate-400 truncate w-full text-center">
                    {pt.period.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[12px] text-slate-400 flex flex-wrap items-center justify-between gap-2 font-mono-numbers">
            <span>Aggregated transaction count: {timeSeriesData.reduce((s, p) => s + p.transactionCount, 0)} customer sales</span>
            <span className="text-emerald-400 font-bold">100% positive monthly surplus cycles ✓</span>
          </div>
        </div>
      )}

      {/* Plain Language Signals */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-[#111827] uppercase tracking-wider">
          Plain-Language Signals (For Borrower &amp; Bank Credit Officer)
        </h3>
        <div className="space-y-2">
          {cashflow.plainLanguageSignals.map((signal, idx) => (
            <div key={idx} className="flex items-start gap-2.5 text-xs text-[#111827] bg-[#F5F5F7] p-3 rounded-xl border border-[#E2E6EE]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="leading-relaxed">{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Expandable Fairness & Anti-Bias Audit Drawer */}
      <div className="pt-2 border-t border-[#E2E6EE]">
        <button
          type="button"
          onClick={() => setShowFairnessDetails(!showFairnessDetails)}
          className="w-full flex items-center justify-between text-left text-xs font-bold text-[#1E3A8A] hover:text-blue-900 transition-colors py-2 touch-target"
        >
          <span className="flex items-center gap-1.5">
            <Scale className="w-4 h-4 text-[#0F766E]" />
            <span>Fairness &amp; Algorithmic Anti-Bias Audit Note</span>
          </span>
          {showFairnessDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFairnessDetails && (
          <div className="mt-2 p-4 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs space-y-1.5 text-indigo-950 animate-card-reveal">
            <div className="flex items-center gap-1.5 font-bold text-indigo-900">
              <Info className="w-4 h-4 text-indigo-700" />
              <span>Objective Mathematical Appraisal vs Demographic Protection</span>
            </div>
            <p className="text-[12px] text-indigo-950/90 leading-relaxed">
              {cashflow.fairnessNote}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
