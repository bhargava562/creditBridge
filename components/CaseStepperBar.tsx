'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BusinessInput } from '@/lib/types';
import sampleProfilesData from '@/data/sampleProfiles.json';
import {
  Check,
  Building2,
  UserCheck,
  ChevronRight,
  RotateCcw,
  Sparkles,
  ShieldAlert
} from 'lucide-react';

const STEPS = [
  { id: 1, path: '/', label: 'Start & Intake', num: '01' },
  { id: 2, path: '/consent', label: 'Consent Gate #1', num: '02' },
  { id: 3, path: '/feed', label: 'Feed & Gaps', num: '03' },
  { id: 4, path: '/approve', label: 'Approval Gate #2', num: '04' },
];

export default function CaseStepperBar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<BusinessInput | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('creditbridge_active_profile');
      if (stored) {
        setProfile(JSON.parse(stored));
      } else {
        setProfile(sampleProfilesData[0] as BusinessInput);
      }
    } catch {
      setProfile(sampleProfilesData[0] as BusinessInput);
    }
  }, [pathname]);

  // Determine current step index (1-based)
  const currentStep = STEPS.find(s => s.path === pathname)?.id || 1;

  return (
    <div className="bg-[#EEF1F6] border-b border-[#E2E6EE] sticky top-16 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          
          {/* 4-Stage Progress Stepper Rail */}
          <nav aria-label="Workflow progress" className="w-full lg:w-auto flex items-center justify-between sm:justify-start gap-1 sm:gap-2 overflow-x-auto py-1">
            {STEPS.map((step, idx) => {
              const isCurrent = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <React.Fragment key={step.id}>
                  {idx > 0 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:block" />
                  )}
                  <Link
                    href={step.path}
                    className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all touch-target select-none shrink-0 ${
                      isCurrent
                        ? 'bg-white text-[#1E3A8A] border border-[#1E3A8A]/30 shadow-xs ring-2 ring-[#1E3A8A]/10'
                        : isPast
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100/70'
                        : 'text-[#4B5563] hover:text-[#111827] hover:bg-white/60'
                    }`}
                  >
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center font-mono-numbers text-[10px] font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-[#1E3A8A] text-white'
                          : isPast
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {isPast ? <Check className="w-3 h-3" /> : step.num}
                    </span>
                    <span className="whitespace-nowrap">{step.label}</span>
                  </Link>
                </React.Fragment>
              );
            })}
          </nav>

          {/* Persistent Active Case Context Bar */}
          {profile && (
            <div className="w-full lg:w-auto flex flex-wrap items-center justify-between lg:justify-end gap-2 text-xs pt-1 lg:pt-0 border-t lg:border-t-0 border-slate-200">
              <div className="flex items-center gap-2">
                <span className="p-1 rounded-md bg-white border border-[#E2E6EE] text-[#1E3A8A]">
                  <Building2 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="font-bold text-[#111827]">{profile.businessName}</span>
                  <span className="text-[#4B5563] ml-1 hidden sm:inline">
                    (₹{(profile.requestedAmount / 100000).toFixed(1)}L Requested)
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {profile.assistedByOperator ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-teal-50 border border-teal-200 text-teal-800 font-semibold text-[11px]">
                    <UserCheck className="w-3 h-3 text-teal-600" />
                    <span>Assisted Mode</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-[#E2E6EE] text-[#4B5563] font-semibold text-[11px]">
                    <span>Self-Service</span>
                  </span>
                )}

                <Link
                  href="/"
                  className="inline-flex items-center gap-1 text-[11px] font-medium text-[#1E3A8A] hover:underline px-1.5 py-0.5 rounded hover:bg-white"
                  title="Change profile or parameters"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span className="hidden sm:inline">Change</span>
                </Link>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
