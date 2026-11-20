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
  CheckCircle,
  Store,
  Factory,
  RotateCcw
} from 'lucide-react';

const SAMPLE_PROFILES: BusinessInput[] = sampleProfilesData as BusinessInput[];

const PROFILE_IMAGES: Record<string, string> = {
  'priya-boutique-solapur': 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?auto=format&fit=crop&w=600&q=80',
  'kumar-fabrication-bengaluru': 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80',
  'aarav-dairy-muzaffarpur': 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80'
};

export default function IntakePanel() {
  const router = useRouter();

  // Selected sample profile ID
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
      alert('Please enter a valid business name and requested loan amount.');
      return;
    }
    // Save to sessionStorage
    sessionStorage.setItem('creditbridge_active_profile', JSON.stringify(formData));
    sessionStorage.removeItem('creditbridge_consent_granted');
    router.push('/consent');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Heading & Overview */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-sm">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold mb-3 border border-emerald-200">
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Step 1 of 4: Minimal Intake & Assisted Operator Setup</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            MSME Scheme Readiness & Cashflow Intake
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
            No 20-page forms, no audited balance sheet prerequisites. Start with your basic business requirements, or pick a verified Indian MSME case study below to see instant time-series cashflow evaluation and rule-cited scheme recommendations.
          </p>
        </div>

        {/* Voice / Natural Language Prompt Helper */}
        <div className="mt-6 pt-5 border-t border-slate-100">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>Voice / Dialect Input Helper (Simulated Assisted Mode):</span>
            </div>
            <button
              type="button"
              onClick={() => setShowVoiceHelp(!showVoiceHelp)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-medium underline"
            >
              {showVoiceHelp ? 'Hide quick voice queries' : 'Try sample spoken audio inputs'}
            </button>
          </div>

          {showVoiceHelp && (
            <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-2 animate-fade-in">
              <p className="text-slate-500 text-[11px]">
                Click any real-life spoken prompt to auto-populate the intake:
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
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-left transition-all"
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
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-left transition-all"
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
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-emerald-500 hover:bg-emerald-50/50 text-slate-700 text-left transition-all"
                >
                  🥛 <strong>Bhojpuri/Hindi:</strong> Muzaffarpur Dairy (₹6L rural new unit)
                </button>
              </div>
            </div>
          )}

          {voiceQuery && (
            <div className="mt-3 p-2.5 bg-emerald-50/70 rounded-lg border border-emerald-200 text-xs text-emerald-900 flex items-center gap-2">
              <span className="font-bold text-emerald-700">Audio Captured:</span>
              <span className="italic">{voiceQuery}</span>
            </div>
          )}
        </div>
      </div>

      {/* Preset Profiles Showcase */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Select a Representative MSME Preset
            </h2>
            <p className="text-xs text-slate-500">
              Each preset includes multi-month continuous UPI/bank time-series records to test real decision logic.
            </p>
          </div>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
            3 Ready Scenarios
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SAMPLE_PROFILES.map((profile) => {
            const isSelected = selectedPresetId === profile.id;
            const imgUrl = PROFILE_IMAGES[profile.id || ''] || PROFILE_IMAGES['priya-boutique-solapur'];

            return (
              <div
                key={profile.id}
                onClick={() => handleSelectPreset(profile.id || '')}
                className={`cursor-pointer rounded-2xl overflow-hidden border transition-all text-left flex flex-col ${
                  isSelected
                    ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/20 shadow-md'
                    : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-xs'
                }`}
              >
                {/* Photo Header */}
                <div className="h-32 w-full relative overflow-hidden bg-slate-100">
                  <img
                    src={imgUrl}
                    alt={profile.businessName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-900/20 to-transparent flex items-end p-3">
                    <span className="text-white text-xs font-bold leading-tight drop-shadow-xs">
                      {profile.businessName}
                    </span>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white rounded-full p-1 shadow-md">
                      <CheckCircle className="w-4 h-4" />
                    </div>
                  )}
                </div>

                {/* Profile Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Stage:</span>
                      <span className="font-semibold text-slate-800 capitalize">
                        {profile.stage} ({profile.yearsInOperation} yrs)
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Requested:</span>
                      <span className="font-bold text-emerald-700">
                        ₹{(profile.requestedAmount / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Location:</span>
                      <span className="font-medium text-slate-700 capitalize">
                        {profile.region.replace('_', ' ')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Special Category:</span>
                      <span className="font-medium text-slate-700">
                        {profile.womenOwned ? 'Women Entrepreneur' : profile.scStOwned ? 'SC/ST Founder' : 'General MSE'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSelectPreset(profile.id || '');
                    }}
                    className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                      isSelected
                        ? 'bg-emerald-600 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isSelected ? 'Loaded into Intake ✓' : 'Load This Preset'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Editable Intake Form */}
      <form onSubmit={handleProceed} className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Active Evaluation Parameters
            </h3>
            <p className="text-xs text-slate-500">
              You can fine-tune any field below or proceed directly with the selected preset.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSelectPreset('priya-boutique-solapur')}
              className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded bg-slate-100"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to Default</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Business Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Store className="w-3.5 h-3.5 text-slate-400" />
              <span>Business / Enterprise Name</span>
            </label>
            <input
              type="text"
              required
              value={formData.businessName}
              onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>

          {/* Business Stage */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-slate-400" />
              <span>Enterprise Stage</span>
            </label>
            <select
              value={formData.stage}
              onChange={(e) => setFormData({ ...formData, stage: e.target.value as BusinessStage })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="existing">Existing Operating Business</option>
              <option value="new">New Venture (Greenfield Setup)</option>
            </select>
          </div>

          {/* Sector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-slate-400" />
              <span>Sector / Industry</span>
            </label>
            <select
              value={formData.sector}
              onChange={(e) => setFormData({ ...formData, sector: e.target.value as BusinessSector })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white capitalize"
            >
              <option value="handicrafts_textiles">Handicrafts & Textiles / Boutique</option>
              <option value="manufacturing">Light Manufacturing & Engineering</option>
              <option value="services">Services & Repair / Tech Work</option>
              <option value="retail_trading">Retail Trading / Kirana Store</option>
              <option value="agri_allied">Agri-Allied / Dairy / Food Processing</option>
            </select>
          </div>

          {/* Requested Amount */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Coins className="w-3.5 h-3.5 text-slate-400" />
                <span>Requested Credit Amount</span>
              </span>
              <span className="text-emerald-700 font-extrabold">
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
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <p className="text-[11px] text-slate-500">
              Matches MUDRA (₹10K - ₹20L), CGTMSE (up to ₹5 Cr), or PMEGP subsidies.
            </p>
          </div>

          {/* Monthly Turnover (or zero for new unit) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
              <span>Avg Monthly Revenue / Turnover</span>
              <span className="text-slate-600 font-bold">
                ₹{formData.monthlyTurnover.toLocaleString('en-IN')}
              </span>
            </label>
            <input
              type="number"
              step="5000"
              min="0"
              value={formData.monthlyTurnover}
              onChange={(e) => setFormData({ ...formData, monthlyTurnover: Number(e.target.value) })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
            <p className="text-[11px] text-slate-500">
              Enter 0 if this is a newly proposed venture.
            </p>
          </div>

          {/* Region */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Location / Geography</span>
            </label>
            <select
              value={formData.region}
              onChange={(e) => setFormData({ ...formData, region: e.target.value as RegionType })}
              className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            >
              <option value="semi_urban">Semi-Urban / Taluka Hub</option>
              <option value="rural">Rural Area (Eligible for 35% PMEGP subsidy)</option>
              <option value="urban">Urban Tier-1 / Tier-2 City</option>
              <option value="ner_aspirational">North-East / Aspirational District</option>
            </select>
          </div>
        </div>

        {/* Affirmative & Registration Toggles */}
        <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">
            Statutory Affirmative & Governance Checkboxes
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.womenOwned}
                onChange={(e) => setFormData({ ...formData, womenOwned: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700">
                Women-Owned Enterprise (85% CGTMSE cover)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.scStOwned}
                onChange={(e) => setFormData({ ...formData, scStOwned: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700">
                SC / ST Promoter (Stand-Up India & PMEGP priority)
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.udyamRegistered}
                onChange={(e) => setFormData({ ...formData, udyamRegistered: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700">
                Has Udyam Registration Certificate
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={formData.hasPropertyCollateral}
                onChange={(e) => setFormData({ ...formData, hasPropertyCollateral: e.target.checked })}
                className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
              />
              <span className="font-medium text-slate-700">
                Has Real Estate / Property Collateral (Unchecked = Collateral-Free)
              </span>
            </label>
          </div>
        </div>

        {/* Assisted Operator Mode Toggle */}
        <div className="p-4 bg-teal-50/60 rounded-xl border border-teal-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-teal-700" />
              <span className="text-xs font-bold text-teal-900">
                Assisted Mode: JanAI Café / Banking Correspondent / SHG Sahayak
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.assistedByOperator}
                onChange={(e) => setFormData({ ...formData, assistedByOperator: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-700"></div>
            </label>
          </div>

          {formData.assistedByOperator && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs animate-fade-in">
              <div className="space-y-1">
                <label className="font-semibold text-teal-900">Operator / Helper Name & Affiliation</label>
                <input
                  type="text"
                  value={formData.operatorName || ''}
                  onChange={(e) => setFormData({ ...formData, operatorName: e.target.value })}
                  placeholder="e.g. Sunita Devi (SHG Bank Sakhi, Solapur)"
                  className="w-full px-3 py-1.5 rounded-lg border border-teal-300 bg-white text-slate-800"
                />
              </div>
              <div className="space-y-1">
                <label className="font-semibold text-teal-900">Assisted Operator Ground Notes</label>
                <input
                  type="text"
                  value={formData.operatorNotes || ''}
                  onChange={(e) => setFormData({ ...formData, operatorNotes: e.target.value })}
                  placeholder="e.g. Physical shop verified, applicant has steady local clientele."
                  className="w-full px-3 py-1.5 rounded-lg border border-teal-300 bg-white text-slate-800"
                />
              </div>
            </div>
          )}
        </div>

        {/* Submit to Consent Gate #1 */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Zero financial record access occurs without your explicit opt-in at the next gate.</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm shadow-md shadow-emerald-700/20 transition-all hover:gap-3"
          >
            <span>Proceed to Consent Gate #1</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
}
