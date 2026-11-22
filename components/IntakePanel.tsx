'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BusinessInput, BusinessSector, BusinessStage, RegionType } from '@/lib/types';
import sampleProfilesData from '@/data/sampleProfiles.json';
import {
  Sparkles,
  UserCheck,
  Building2,
  Coins,
  MapPin,
  Mic,
  ArrowRight,
  CheckCircle2,
  Store,
  Layers,
  TrendingUp,
  ShieldCheck,
  RotateCcw,
  BadgeCheck,
  HelpCircle,
  FileCheck2,
  ArrowDown
} from 'lucide-react';

const SAMPLE_PROFILES: BusinessInput[] = sampleProfilesData as BusinessInput[];

export default function IntakePanel() {
  const router = useRouter();

  // Selected preset profile ID
  const [selectedPresetId, setSelectedPresetId] = useState<string>('priya-boutique-solapur');

  // Form State
  const [formData, setFormData] = useState<BusinessInput>(SAMPLE_PROFILES[0]);
  const [voiceQuery, setVoiceQuery] = useState<string>('');
  const [showVoiceHelp, setShowVoiceHelp] = useState<boolean>(false);

  // Load selected preset
  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const found = SAMPLE_PROFILES.find(p => p.id === presetId);
    if (found) {
      setFormData(JSON.parse(JSON.stringify(found)));
    }
  };

  // Pre-load on mount or restore from sessionStorage
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('creditbridge_active_profile');
      if (saved) {
        const parsed = JSON.parse(saved);
        setFormData(parsed);
        if (parsed.id) setSelectedPresetId(parsed.id);
      }
    } catch {
      // fallback to initial state
    }
  }, []);

  // Quick voice query handler
  const handleSimulateVoice = (transcript: string, matchedPresetId: string) => {
    setVoiceQuery(transcript);
    handleSelectPreset(matchedPresetId);
    setShowVoiceHelp(false);
  };

  // Submit and navigate to /consent
  const handleProceed = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.businessName || formData.requestedAmount <= 0) {
      alert('Please enter a valid business name and requested credit amount.');
      return;
    }
    // Save to sessionStorage
    sessionStorage.setItem('creditbridge_active_profile', JSON.stringify(formData));
    sessionStorage.removeItem('creditbridge_consent_granted');
    sessionStorage.removeItem('creditbridge_evaluation_result');
    router.push('/consent');
  };

  const scrollToPresets = () => {
    const el = document.getElementById('presets-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="space-y-10 animate-card-reveal pb-12">
      {/* 1. Split Hero Section */}
      <div className="hero-gradient-card p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute right-10 top-10 w-40 h-40 rounded-full bg-emerald-400/10 blur-xl pointer-events-none" />

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-white text-xs font-semibold border border-white/20">
            <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
            <span>Tech4Bharat 2026 • Problem Statement 3.2: Formal Credit &amp; Schemes</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-extrabold tracking-tight leading-[1.15] text-white">
            Find the Exact Central Scheme That Fits Your Real Cashflow.
          </h1>

          <p className="text-base sm:text-lg text-slate-100 font-normal leading-[1.6] max-w-2xl">
            A deterministic pre-application decision engine for Indian micro-enterprises. We analyze continuous UPI QR receipts and bank turnover velocity under official <strong>PM MUDRA, CGTMSE, and PMEGP</strong> rules—with zero paperwork guessing, zero broker commissions, and explicit two-gate consent.
          </p>

          <div className="pt-3 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={scrollToPresets}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-[#1E3A8A] font-bold text-sm shadow-lg shadow-black/15 transition-all touch-target"
            >
              <span>Start in 30 Seconds</span>
              <ArrowDown className="w-4 h-4 text-[#1E3A8A]" />
            </button>

            <a
              href="https://credit-bridge-alpha.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-1.5 px-4 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 backdrop-blur-sm transition-colors touch-target"
            >
              <span>Explore Live Deployment 🌐</span>
            </a>
          </div>

          {/* Quick value props pill row */}
          <div className="pt-4 flex flex-wrap items-center gap-4 text-xs text-slate-200 border-t border-white/15">
            <span className="flex items-center gap-1.5">
              <BadgeCheck className="w-4 h-4 text-emerald-300" />
              <span>100% Statutory Citations (DFS/RBI)</span>
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-300" />
              <span>Zero Credit Bureau Penalty</span>
            </span>
            <span className="flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-300" />
              <span>JanAI Café / Assisted Mode Ready</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Three-Tile Bento Architecture Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Bento Tile 1: Deck Feed Choices */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 text-[#1E3A8A] flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-[#1E3A8A]" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Bento-to-Deck Feed Choices
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Browse scannable scheme cards with real-time statutory circular citations from DFS &amp; RBI. Flags wrong-stage schemes early with clear reasons.
            </p>
          </div>
          <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-700">Scheme Matcher</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[11px]">
              Likely Fit ✓
            </span>
          </div>
        </div>

        {/* Bento Tile 2: Continuous Time-Series */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 text-[#0F766E] flex items-center justify-center font-bold">
              <TrendingUp className="w-5 h-5 text-[#0F766E]" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Continuous Cashflow Trend
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Turns monthly UPI &amp; bank turnover into plain-language signals and debt capacity buffers. Anti-bias rules protect women and rural founders without scoring penalties.
            </p>
          </div>
          <div className="p-3 bg-[#F5F5F7] rounded-xl border border-[#E2E6EE] text-xs flex items-center justify-between">
            <span className="font-semibold text-slate-700">UPI QR Consistency</span>
            <span className="font-mono-numbers font-bold text-teal-800">
              82% Verified Digital
            </span>
          </div>
        </div>

        {/* Bento Tile 3: Two-Gate Consent & Approval */}
        <div className="bento-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-[#111827]">
              Two-Gate Consent &amp; Sign-Off
            </h3>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              Explicit permission before inspecting cashflow (Gate #1) and mandatory entrepreneur approval before generating the final readiness certificate (Gate #2).
            </p>
          </div>
          <div className="p-3 bg-slate-900 text-white rounded-xl text-xs flex items-center justify-between font-mono-numbers">
            <span className="text-slate-300">Gate #1 Consent</span>
            <span className="text-emerald-400 font-bold">Gate #2 Signed</span>
          </div>
        </div>
      </div>

      {/* 3. Representative MSME Presets Showcase */}
      <div id="presets-section" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
              Select a Representative MSME Preset
            </h2>
            <p className="text-sm text-[#4B5563]">
              Each preset includes multi-month continuous UPI &amp; bank cashflow records to test deterministic decision logic.
            </p>
          </div>
          <span className="text-xs font-bold text-[#1E3A8A] bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full">
            3 Ready Case Studies
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_PROFILES.map((profile) => {
            const isSelected = selectedPresetId === profile.id;

            return (
              <div
                key={profile.id}
                onClick={() => handleSelectPreset(profile.id || '')}
                className={`bento-card bento-card-interactive p-5 flex flex-col justify-between space-y-4 text-left ${
                  isSelected
                    ? 'ring-2 ring-[#1E3A8A] border-[#1E3A8A] bg-indigo-50/20'
                    : 'hover:border-slate-300'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 border border-[#E2E6EE] flex items-center justify-center text-slate-800 font-bold text-sm">
                      {profile.sector === 'handicrafts_textiles' ? '🧵' : profile.sector === 'manufacturing' ? '⚙️' : '🥛'}
                    </div>
                    {isSelected ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        <span>Loaded</span>
                      </span>
                    ) : (
                      <span className="text-[11px] font-medium text-slate-400">Click to Load</span>
                    )}
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#111827] leading-snug">
                      {profile.businessName}
                    </h3>
                    <p className="text-xs text-[#4B5563] mt-0.5 capitalize">
                      {profile.stage} unit • {profile.region.replace('_', ' ')}
                    </p>
                  </div>

                  <div className="p-3 bg-[#EEF1F6] rounded-xl space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[#4B5563]">Requested:</span>
                      <span className="font-mono-numbers font-bold text-emerald-800 text-sm">
                        ₹{(profile.requestedAmount / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#4B5563]">Category:</span>
                      <span className="font-medium text-[#111827]">
                        {profile.womenOwned ? 'Women Entrepreneur' : profile.scStOwned ? 'SC/ST Founder' : 'General MSE'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#4B5563]">Turnover:</span>
                      <span className="font-mono-numbers text-slate-700">
                        {profile.monthlyTurnover > 0 ? `₹${profile.monthlyTurnover.toLocaleString('en-IN')}/mo` : 'New Venture'}
                      </span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectPreset(profile.id || '');
                  }}
                  className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all touch-target ${
                    isSelected
                      ? 'bg-[#1E3A8A] text-white shadow-sm'
                      : 'bg-white border border-[#E2E6EE] hover:bg-slate-50 text-[#111827]'
                  }`}
                >
                  {isSelected ? 'Preset Active in Intake ✓' : 'Load This Preset'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Natural Dialect Audio Helper (Simulated Assisted Mode) */}
      <div className="bento-card p-5 sm:p-6 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-sm font-bold text-[#111827]">
            <Mic className="w-4 h-4 text-[#0F766E]" />
            <span>Spoken Dialect Audio Helper (Simulated Assisted Mode)</span>
          </div>
          <button
            type="button"
            onClick={() => setShowVoiceHelp(!showVoiceHelp)}
            className="text-xs text-[#0F766E] hover:underline font-semibold"
          >
            {showVoiceHelp ? 'Hide quick voice queries' : 'Try sample spoken audio inputs'}
          </button>
        </div>

        {showVoiceHelp && (
          <div className="p-3 bg-[#EEF1F6] rounded-xl border border-[#E2E6EE] text-xs space-y-2 animate-card-reveal">
            <p className="text-[#4B5563] text-[11px]">
              Click any real-life spoken prompt to auto-populate the intake parameters:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() =>
                  handleSimulateVoice(
                    '“Solapur mein meri 4 saal purani boutique hai, daily GooglePay payment aati hai. 2 nayi machine ke liye ₹3.5 Lakh chahiye.”',
                    'priya-boutique-solapur'
                  )
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E6EE] hover:border-[#1E3A8A] hover:bg-indigo-50/50 text-[#111827] text-left transition-all"
              >
                🧵 <strong>Marathi/Hindi:</strong> Solapur Boutique (₹3.5L machine loan)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSimulateVoice(
                    '“Peenya fabrication workshop 3 years operating, mild steel grill fabrication. Need ₹8.5 Lakhs for fiber laser cutter under MUDRA.”',
                    'kumar-fabrication-bengaluru'
                  )
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E6EE] hover:border-[#1E3A8A] hover:bg-indigo-50/50 text-[#111827] text-left transition-all"
              >
                ⚙️ <strong>Kannada/English:</strong> Peenya Fabrication (₹8.5L expansion)
              </button>
              <button
                type="button"
                onClick={() =>
                  handleSimulateVoice(
                    '“Muzaffarpur mein naya dairy chilling farm shuru karna hai. SC category se hu, PMEGP subsidy aur ₹6 Lakhs loan dekhna hai.”',
                    'aarav-dairy-muzaffarpur'
                  )
                }
                className="px-3 py-2 rounded-lg bg-white border border-[#E2E6EE] hover:border-[#1E3A8A] hover:bg-indigo-50/50 text-[#111827] text-left transition-all"
              >
                🥛 <strong>Bhojpuri/Hindi:</strong> Muzaffarpur Dairy (₹6L rural new unit)
              </button>
            </div>
          </div>
        )}

        {voiceQuery && (
          <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
            <span className="font-bold text-emerald-700">Audio Captured:</span>
            <span className="italic">{voiceQuery}</span>
          </div>
        )}
      </div>

      {/* 5. Active Intake Parameters Bento Form */}
      <form onSubmit={handleProceed} className="bento-card p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#E2E6EE]">
          <div>
            <h2 className="text-xl font-bold text-[#111827]">
              Intake Parameters &amp; Requirements
            </h2>
            <p className="text-xs text-[#4B5563]">
              Modify any parameter below or proceed directly with the selected preset.
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleSelectPreset('priya-boutique-solapur')}
            className="inline-flex items-center gap-1.5 text-xs text-[#4B5563] hover:text-[#111827] px-3 py-1.5 rounded-lg bg-[#EEF1F6] hover:bg-slate-200 font-medium transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to Solapur Boutique</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>Enterprise / Unit Name</span>
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white touch-target"
            />
          </div>

          {/* Business Stage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Enterprise Stage</span>
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as BusinessStage })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white touch-target"
            >
              <option value="existing">Existing Operating Business</option>
              <option value="new">New Venture (Greenfield Setup)</option>
            </select>
          </div>

          {/* Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Sector / Industry</span>
            </label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as BusinessSector })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white touch-target capitalize"
            >
              <option value="handicrafts_textiles">Handicrafts &amp; Textiles / Boutique</option>
              <option value="manufacturing">Light Manufacturing &amp; Engineering</option>
              <option value="services">Services &amp; Repair / Tech Work</option>
              <option value="retail_trading">Retail Trading / Kirana Store</option>
              <option value="agri_allied">Agri-Allied / Dairy / Food Processing</option>
            </select>
          </div>

          {/* Requested Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>Requested Credit Amount</span>
              </span>
              <span className="text-[#0F766E] font-mono-numbers font-extrabold text-sm">
                ₹{formData.requestedAmount.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="number"
              step="10000"
              min="10000"
              max="20000000"
              value={formData.requestedAmount}
              onChange={(e) => setFormData({ ...formData, requestedAmount: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white font-mono-numbers touch-target"
            />
            <p className="text-[11px] text-[#4B5563]">
              Appraises under MUDRA (₹10K-₹20L), CGTMSE (up to ₹5 Cr), or PMEGP.
            </p>
          </div>

          {/* Monthly Turnover */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center justify-between">
              <span>Avg Monthly Revenue / Turnover</span>
              <span className="text-[#4B5563] font-mono-numbers font-bold">
                ₹{formData.monthlyTurnover.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="number"
              step="5000"
              min="0"
              value={formData.monthlyTurnover}
              onChange={(e) => setFormData({ ...formData, monthlyTurnover: Number(e.target.value) })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white font-mono-numbers touch-target"
            />
            <p className="text-[11px] text-[#4B5563]">
              Enter 0 if this is a newly proposed venture.
            </p>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-[#111827] flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Geography / Region</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionType })}
              className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-[#E2E6EE] focus:outline-none focus:ring-2 focus:ring-[#1E3A8A] bg-white touch-target"
            >
              <option value="semi_urban">Semi-Urban / Taluka Hub</option>
              <option value="rural">Rural Area (Eligible for 35% PMEGP subsidy)</option>
              <option value="urban">Urban Tier-1 / Tier-2 City</option>
              <option value="ner_aspirational">North-East / Aspirational District</option>
            </select>
          </div>
        </div>

        {/* Affirmative & Statutory Checkboxes */}
        <div className="p-4 bg-[#EEF1F6] rounded-xl border border-[#E2E6EE] space-y-3">
          <span className="text-xs font-bold text-[#111827] uppercase tracking-wide">
            Statutory Affirmative &amp; Governance Checkboxes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.womenOwned}
                onChange={(e) => setFormData({ ...formData, womenOwned: e.target.checked })}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span className="font-semibold text-slate-800">
                Women-Owned Enterprise (85% CGTMSE cover)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.scStOwned}
                onChange={(e) => setFormData({ ...formData, scStOwned: e.target.checked })}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span className="font-semibold text-slate-800">
                SC / ST Promoter (Stand-Up India &amp; PMEGP)
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.udyamRegistered}
                onChange={(e) => setFormData({ ...formData, udyamRegistered: e.target.checked })}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span className="font-semibold text-slate-800">
                Has Udyam Registration Certificate
              </span>
            </label>

            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasPropertyCollateral}
                onChange={(e) => setFormData({ ...formData, hasPropertyCollateral: e.target.checked })}
                className="w-4 h-4 text-[#0F766E] rounded border-slate-300 focus:ring-[#0F766E]"
              />
              <span className="font-semibold text-slate-800">
                Has Property Collateral (Unchecked = Collateral-Free)
              </span>
            </label>
          </div>
        </div>

        {/* Assisted Operator Mode Toggle */}
        <div className="p-4 bg-teal-50/70 rounded-xl border border-teal-200/90 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-800" />
              <span className="text-xs font-bold text-teal-950">
                Assisted Operator Mode: JanAI Café / Banking Correspondent / SHG Helper
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.assistedByOperator}
                onChange={(e) => setFormData({ ...formData, assistedByOperator: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-10 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-700"></div>
            </label>
          </div>

          {formData.assistedByOperator && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs animate-card-reveal">
              <div className="space-y-1">
                <label className="font-bold text-teal-950">Operator Name &amp; Affiliation</label>
                <input
                  type="text"
                  value={formData.operatorName || ''}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  placeholder="e.g. Sunita Devi (SHG Bank Sakhi, Solapur)"
                  className="w-full px-3.5 py-2 rounded-lg border border-teal-300 bg-white text-slate-800 touch-target"
                />
              </div>
              <div className="space-y-1">
                <label className="font-bold text-teal-950">Operator Field Notes</label>
                <input
                  type="text"
                  value={formData.operatorNotes || ''}
                  onChange={(e) => setFormData({ ...formData, operatorNotes: e.target.value })}
                  placeholder="e.g. Physical shop verified, applicant has steady customer footfall."
                  className="w-full px-3.5 py-2 rounded-lg border border-teal-300 bg-white text-slate-800 touch-target"
                />
              </div>
            </div>
          )}
        </div>

        {/* Form Action Button */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#4B5563]">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Zero financial record access occurs without your explicit opt-in at Gate #1.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-[#1E3A8A] hover:bg-blue-900 text-white font-bold text-sm shadow-md shadow-indigo-950/20 transition-all hover:gap-3 touch-target"
          >
            <span>Continue to Step 2: Consent Gate #1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
