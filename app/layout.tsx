import type { Metadata } from 'next';
import './globals.css';
import Link from 'next/link';
import { ShieldCheck, Info, FileText, CheckCircle2, ChevronRight, HelpCircle } from 'lucide-react';

export const metadata: Metadata = {
  title: 'CreditBridge — Pre-Application Cashflow & Scheme Readiness for MSMEs',
  description: 'Deterministic pre-application readiness, cashflow time-series trend analysis, and rule-cited scheme recommendation engine for Indian micro-enterprises. Built for Tech4Bharat 2026.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 font-sans">
        {/* Top Persistent Notice & Demo Disclosure */}
        <div className="bg-amber-500/10 border-b border-amber-200/80 px-4 py-2 text-xs text-amber-900 text-center font-medium">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-600 text-white font-semibold text-[10px] tracking-wide uppercase">
              Tech4Bharat 2026 Prototype
            </span>
            <span>
              <strong>Problem Statement 3.2: Formal Credit & Schemes</strong> — Deterministic rule-matching & cashflow time-series analysis with statutory citations.
            </span>
            <span className="text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded text-[11px]">
              🔒 Sample & Consented Data Demo Mode
            </span>
          </div>
        </div>

        {/* Header */}
        <header className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-linear-to-br from-emerald-600 to-teal-800 text-white flex items-center justify-center font-black text-xl shadow-sm shadow-emerald-500/30 group-hover:scale-105 transition-transform">
                  CB
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-lg tracking-tight text-slate-900">
                      CreditBridge
                    </span>
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                      MSME AI Layer
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 hidden sm:block">
                    Pre-Application Cashflow & Scheme Readiness Engine
                  </p>
                </div>
              </Link>

              {/* Navigation Steps Indicator */}
              <nav aria-label="Progress Steps" className="hidden md:flex items-center gap-2 text-xs font-medium text-slate-600">
                <Link href="/" className="flex items-center gap-1 hover:text-emerald-700 px-2 py-1 rounded transition-colors">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">1</span>
                  <span>Intake</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/consent" className="flex items-center gap-1 hover:text-emerald-700 px-2 py-1 rounded transition-colors">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">2</span>
                  <span>Consent Gate</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/feed" className="flex items-center gap-1 hover:text-emerald-700 px-2 py-1 rounded transition-colors">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">3</span>
                  <span>Feed & Gaps</span>
                </Link>
                <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                <Link href="/approve" className="flex items-center gap-1 hover:text-emerald-700 px-2 py-1 rounded transition-colors">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center text-[11px] font-bold">4</span>
                  <span>Approval Gate</span>
                </Link>
              </nav>

              {/* Badges / Links */}
              <div className="flex items-center gap-3 text-xs">
                <a
                  href="https://www.jansamarth.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden lg:flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-500" />
                  <span>JanSamarth Portal</span>
                </a>
                <span className="inline-flex items-center gap-1 text-emerald-800 font-semibold bg-emerald-50 border border-emerald-200/80 px-2.5 py-1 rounded-full text-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Rule-Cited AI</span>
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 text-slate-600 text-xs py-8 mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              <div>
                <h4 className="font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  CreditBridge Guardrails
                </h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Engineered to stop micro-enterprises from applying to mismatched schemes. Powered by deterministic statutory rules, never unverified generative text.
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Supported Central Schemes</h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• PM MUDRA Yojana (Shishu, Kishore, Tarun, Tarun Plus)</li>
                  <li>• CGTMSE Credit Guarantee Scheme for MSEs</li>
                  <li>• Prime Minister's Employment Generation Programme (PMEGP)</li>
                  <li>• Stand-Up India Scheme for Women & SC/ST Entrepreneurs</li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Official Portal Gateways</h4>
                <ul className="space-y-1 text-[11px] text-slate-600">
                  <li>• <a href="https://www.jansamarth.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">JanSamarth National Portal</a></li>
                  <li>• <a href="https://udyamregistration.gov.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">Udyam Registration (Zero Fee)</a></li>
                  <li>• <a href="https://www.mudra.org.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">MUDRA SIDBI Portal</a></li>
                  <li>• <a href="https://www.cgtmse.in" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline">CGTMSE Trust Portal</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-slate-900 mb-2">Fairness & Consent Framework</h4>
                <p className="text-slate-500 text-[11px] leading-relaxed">
                  Explicit opt-in required prior to reading cashflow records. No algorithmic bias or penalization for informal or women-owned businesses.
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-400">
              <p>© 2026 CreditBridge • Tech4Bharat 2026 Track: MSME Finance & Compliance</p>
              <p>Self-contained Next.js App Router Architecture</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
