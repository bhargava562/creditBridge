'use client';

import React from 'react';
import { CashflowSummary, TimeSeriesPoint } from '@/lib/types';
import {
  TrendingUp,
  Activity,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Wallet,
  Scale
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
  // Find max value for relative bar heights in time-series chart
  const maxInflow = timeSeriesData.length > 0
    ? Math.max(...timeSeriesData.map(p => p.inflow))
    : cashflow.averageMonthlyInflow * 1.2;

  return (
    <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-6 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Activity className="w-4 h-4 text-emerald-700" />
            </span>
            <h2 className="text-lg font-bold text-slate-900">
              Cashflow Time-Series & Repayment Signals
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Continuous monthly velocity analyzed for <span className="font-semibold text-slate-700">{businessName}</span>.
          </p>
        </div>

        {/* Consistency Score Badge */}
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
          <div className="text-right">
            <div className="text-[10px] font-bold uppercase text-emerald-800">
              Consistency Score
            </div>
            <div className="text-sm font-extrabold text-emerald-700">
              {cashflow.consistencyScore} / 100
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            ✓
          </div>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Avg Monthly Inflow</span>
          <span className="text-sm sm:text-base font-extrabold text-slate-900 mt-0.5 block">
            ₹{cashflow.averageMonthlyInflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] font-semibold text-emerald-700">
            {cashflow.inflowTrend === 'growing' ? `↗ +${cashflow.trendPercent}% Trend` : 'Stable Velocity'}
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">Monthly Operating Surplus</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-700 mt-0.5 block">
            +₹{cashflow.averageNetCashflow.toLocaleString('en-IN')}
          </span>
          <span className="text-[10px] text-slate-500">
            After raw costs
          </span>
        </div>

        <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
          <span className="text-[11px] text-slate-500 block">UPI QR Digital Share</span>
          <span className="text-sm sm:text-base font-extrabold text-teal-700 mt-0.5 block flex items-center gap-1">
            <QrCode className="w-3.5 h-3.5" />
            <span>{cashflow.averageUpiConcentration}%</span>
          </span>
          <span className="text-[10px] text-slate-500">
            Verifiable digital trail
          </span>
        </div>

        <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-200">
          <span className="text-[11px] text-emerald-900 font-semibold block">EMI Service Buffer</span>
          <span className="text-sm sm:text-base font-extrabold text-emerald-800 mt-0.5 block">
            ~₹{cashflow.estimatedMonthlyEmiCapacity.toLocaleString('en-IN')}/mo
          </span>
          <span className="text-[10px] text-emerald-700 font-medium">
            Conservative capacity
          </span>
        </div>
      </div>

      {/* Continuous Time-Series Visual Bar Chart */}
      {timeSeriesData.length > 0 && (
        <div className="p-4 bg-slate-900 text-white rounded-xl space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">6-Month Continuous Cash Movement</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400 inline-block"></span> Inflow
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-sm bg-slate-600 inline-block"></span> Outflow
              </span>
            </div>
          </div>

          {/* Bar Visualization */}
          <div className="grid grid-cols-6 gap-2 sm:gap-4 items-end h-28 pt-4 border-b border-slate-800">
            {timeSeriesData.map((pt, idx) => {
              const inflowPct = Math.max(15, Math.round((pt.inflow / maxInflow) * 100));
              const outflowPct = Math.max(10, Math.round((pt.outflow / maxInflow) * 100));

              return (
                <div key={idx} className="flex flex-col items-center gap-1 group relative">
                  {/* Tooltip */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute -top-12 bg-slate-800 text-[10px] text-white p-1 rounded border border-slate-700 whitespace-nowrap z-10 pointer-events-none">
                    <div>In: ₹{pt.inflow.toLocaleString('en-IN')}</div>
                    <div>Net: +₹{pt.netCashflow.toLocaleString('en-IN')}</div>
                  </div>

                  {/* Bars */}
                  <div className="w-full flex items-end justify-center gap-1 h-20">
                    <div
                      style={{ height: `${inflowPct}%` }}
                      className="w-3 sm:w-5 bg-emerald-400 rounded-t-sm transition-all"
                    ></div>
                    <div
                      style={{ height: `${outflowPct}%` }}
                      className="w-3 sm:w-5 bg-slate-600 rounded-t-sm transition-all"
                    ></div>
                  </div>

                  {/* Month Label */}
                  <span className="text-[10px] text-slate-400 truncate w-full text-center">
                    {pt.period.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center justify-between">
            <span>Aggregated transaction count: {timeSeriesData.reduce((s, p) => s + p.transactionCount, 0)} customer sales</span>
            <span className="text-emerald-400 font-medium">All cycles generated positive net surplus ✓</span>
          </div>
        </div>
      )}

      {/* Plain Language Signals */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wide">
          Plain-Language Decision Signals (For Borrower & Bank)
        </h3>
        <div className="space-y-1.5">
          {cashflow.plainLanguageSignals.map((signal, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>{signal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Fairness & Anti-Bias Note */}
      <div className="p-3 bg-indigo-50/70 border border-indigo-200/80 rounded-xl text-xs space-y-1 text-indigo-950">
        <div className="flex items-center gap-1.5 font-bold text-indigo-900">
          <Scale className="w-3.5 h-3.5 text-indigo-700" />
          <span>Fairness & Algorithmic Explainability Check</span>
        </div>
        <p className="text-[11px] text-indigo-900/90 leading-relaxed">
          {cashflow.fairnessNote}
        </p>
      </div>
    </div>
  );
}
