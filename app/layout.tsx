import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ShieldCheck, FileText, Sparkles } from 'lucide-react';
import CaseStepperBar from '@/components/CaseStepperBar';

export const metadata: Metadata = {
  title: 'CreditBridge — Pre-Application Cashflow & Scheme Readiness for MSMEs',
  description: 'Deterministic pre-application readiness, continuous time-series cashflow trends, and rule-cited scheme recommendation engine for Indian micro-enterprises. Built for Tech4Bharat 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-[#F5F5F7] text-[#111827]">
        {/* Top Persistent Notice & Demo Disclosure */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-950 text-center font-medium">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-600 text-white font-bold text-[10px] tracking-wide uppercase shadow-xs">
              Tech4Bharat 2026 Prototype
            </span>
            <span className="text-[12px] font-medium">
              <strong>Problem Statement 3.2: Formal Credit & Schemes</strong> — Deterministic rule-matching & cashflow time-series analysis with statutory citations.
            </span>
            <span className="text-amber-900 bg-amber-100/90 border border-amber-300/80 px-2.5 py-0.5 rounded-full text-[11px] font-semibold">
              🔒 Consented Sample Data Demo Mode
            </span>
          </div>
        </div>

        {/* Global Header */}
        <header className="bg-white/90 backdrop-blur-md border-b border-[#E2E6EE] sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#1E3A8A] to-[#0F766E] text-white flex items-center justify-center font-extrabold text-xl shadow-md shadow-indigo-900/20 group-hover:scale-105 transition-transform">
                  CB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-[#111827]">
                      CreditBridge
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      MSME Decision Layer
                    </span>
                  </div>
                  <p className="text-[12px] text-[#4B5563] hidden sm:block">
                    Cashflow-First Scheme Readiness & Pre-Application Engine
                  </p>
                </div>
              </Link>

              {/* Badges / Links */}
              <div className="flex items-center gap-3 text-xs">
                <a
                  href="https://www.jansamarth.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#EEF1F6] hover:bg-slate-200 text-[#111827] font-semibold transition-colors border border-[#E2E6EE]"
                >
                  <FileText className="w-3.5 h-3.5 text-[#4B5563]" />
                  <span>JanSamarth Portal</span>
                </a>
                <span className="inline-flex items-center gap-1.5 text-emerald-800 font-bold bg-emerald-50 border border-emerald-300 px-3 py-1.5 rounded-full text-xs shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>100% Rule-Cited AI</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Persistent Stepper Rail & Active Case Bar */}
        <CaseStepperBar />

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-[#E2E6EE] text-[#4B5563] text-xs py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-[#111827] mb-2 flex items-center gap-1.5 text-[13px]">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CreditBridge Guardrails
                </h4>
                <p className="text-[#4B5563] text-[12px] leading-relaxed">
                  Engineered to prevent micro-enterprises from applying to mismatched schemes. Powered by deterministic central rules, continuous time-series cashflow, and explicit consent gates.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#111827] mb-2 text-[13px]">Supported Central Schemes</h4>
                <ul className="space-y-1 text-[12px] text-[#4B5563]">
                  <li>• PM MUDRA Yojana (Shishu, Kishore, Tarun, Tarun Plus)</li>
                  <li>• CGTMSE Credit Guarantee Scheme for MSEs (85% cover)</li>
                  <li>• Prime Minister&apos;s Employment Generation Programme (PMEGP)</li>
                  <li>• Stand-Up India Scheme for Women &amp; SC/ST Founders</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#111827] mb-2 text-[13px]">Official Portal Gateways</h4>
                <ul className="space-y-1 text-[12px] text-[#4B5563]">
                  <li>• <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-medium">JanSamarth National Portal</a></li>
                  <li>• <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-medium">Udyam Registration (Zero Fee)</a></li>
                  <li>• <a href="https://www.mudra.org.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-medium">MUDRA SIDBI Portal</a></li>
                  <li>• <a href="https://www.cgtmse.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline font-medium">CGTMSE Trust Portal</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#111827] mb-2 text-[13px]">Fairness &amp; Consent Framework</h4>
                <p className="text-[#4B5563] text-[12px] leading-relaxed">
                  Explicit opt-in required prior to reading cashflow records. No algorithmic bias or penalization for informal, rural, or women-owned businesses.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E2E6EE] flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-[#4B5563]">
              <p>© 2026 CreditBridge • Tech4Bharat 2026 Track: MSME Finance &amp; Compliance</p>
              <p>Self-contained Next.js App Router Architecture</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
