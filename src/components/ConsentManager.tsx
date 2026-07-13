import React, { useState } from 'react';
import { ShieldCheck, Calendar, Lock, Database, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';

interface ConsentManagerProps {
  enterpriseName: string;
  onConsentGranted: (consented: boolean) => void;
  isConsented: boolean;
}

export default function ConsentManager({ enterpriseName, onConsentGranted, isConsented }: ConsentManagerProps) {
  const [consents, setConsents] = useState({
    gst: true,
    upi: true,
    aa: true,
    epfo: true,
    utility: true
  });

  const toggleConsent = (key: keyof typeof consents) => {
    setConsents(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const allConsented = consents.gst && consents.upi && consents.aa && consents.epfo && consents.utility;

  const handleGrantConsent = () => {
    onConsentGranted(true);
  };

  const handleRevokeConsent = () => {
    onConsentGranted(false);
  };

  const consentItems = [
    {
      id: 'gst' as const,
      name: 'GSTN Invoice Registry (GSTR-1 & 3B)',
      description: 'Accesses consolidated monthly sales turnover, tax liability, and return filing timestamps for revenue validation.',
      source: 'Ministry of Finance, Govt of India',
      validity: '12 Months'
    },
    {
      id: 'upi' as const,
      name: 'UPI Merchant QR Settlements',
      description: 'Fetches digital payment settlement volumes, customer retention metrics, and daily payment failure/bounce rates.',
      source: 'NPCI (National Payments Corporation of India)',
      validity: '12 Months'
    },
    {
      id: 'aa' as const,
      name: 'Account Aggregator (FIP Network)',
      description: 'Queries active current account daily balances, monthly inflows/outflows, credit limits, and cheque return events.',
      source: 'RBI-Licensed Account Aggregator ecosystem',
      validity: 'Single-use / 6 Months'
    },
    {
      id: 'epfo' as const,
      name: 'EPFO Corporate Payroll Registry',
      description: 'Validates formal employment scale, active employee count, and monthly retirement contribution punctuality.',
      source: 'Employees Provident Fund Organisation',
      validity: '6 Months'
    },
    {
      id: 'utility' as const,
      name: 'Utility Utilities Infrastructure (Electricity & Telecom)',
      description: 'Validates monthly electricity bill consumption levels and telecommunication punctuality as stability parameters.',
      source: 'State DISCOMs & Telecom Operators',
      validity: '12 Months'
    }
  ];

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 lg:p-8 shadow-xl" id="consent-manager-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-800 pb-6 mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-950/40 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> DEPA Compliant
            </span>
            <span className="text-xs text-slate-500 font-mono">v1.2.0-ULI</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Consent & Data Authorization</h2>
          <p className="text-slate-400 text-xs mt-1">
            Under India's DPDP Act, authorize secure alternate telemetry extraction for <strong className="text-slate-300">{enterpriseName}</strong>.
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-950/80 px-3 py-1.5 rounded-lg border border-slate-800">
            <Lock className="w-3.5 h-3.5 text-slate-500" />
            <span>256-bit AES Encryption</span>
          </div>
        </div>
      </div>

      {!isConsented ? (
        <div>
          <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 mb-6 flex gap-3 text-xs text-amber-300">
            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-white">Credit invisible or incomplete record?</strong> Alternative transaction footprints (GST, UPI, EPFO) enable real-time scoring to bypass strict collateral mandates. Grant secure consent below to initiate processing.
            </div>
          </div>

          <div className="space-y-4">
            {consentItems.map((item) => {
              const active = consents[item.id];
              return (
                <div 
                  key={item.id}
                  className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                    active 
                      ? 'border-teal-500/30 bg-teal-950/20 shadow-md bento-glow-teal' 
                      : 'border-slate-800/80 bg-slate-950/45 hover:bg-slate-900/40'
                  }`}
                  onClick={() => toggleConsent(item.id)}
                  id={`consent-card-${item.id}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className={`mt-1 p-1.5 rounded-lg border transition-all ${
                        active 
                          ? 'bg-gradient-to-tr from-teal-500 to-emerald-500 text-white border-teal-500/30' 
                          : 'bg-slate-850 text-slate-500 border-slate-800'
                      }`}>
                        <Database className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-sm">{item.name}</h3>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5">
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            Source: <strong className="text-slate-400 font-medium">{item.source}</strong>
                          </span>
                          <span className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-600" />
                            Validity: <strong className="text-slate-400 font-medium">{item.validity}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors duration-200 focus:outline-none shrink-0 ${
                        active ? 'bg-teal-600' : 'bg-slate-800'
                      }`}
                      aria-checked={active}
                    >
                      <div
                        className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-200 ${
                          active ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/60">
            <div className="text-xs text-slate-400 text-center sm:text-left leading-relaxed">
              By clicking authorize, you consent to secure, real-time pipeline fetching via the safe <strong className="text-teal-400 font-semibold">Account Aggregator Framework</strong>.
            </div>
            <button
              onClick={handleGrantConsent}
              disabled={!allConsented}
              className={`px-6 py-3 rounded-lg font-bold text-xs tracking-tight shadow-md flex items-center gap-2 cursor-pointer transition-all ${
                allConsented 
                  ? 'bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 text-white hover:shadow-lg border border-teal-500/30 bento-glow-teal' 
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-850'
              }`}
              id="btn-grant-consent"
            >
              Authorize & Fetch Alternative Data
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : (
        <div className="py-8 text-center" id="consent-granted-alert">
          <div className="w-16 h-16 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-800/50 flex items-center justify-center mx-auto mb-4 animate-pulse">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Secure Alternate Connections Established</h3>
          <p className="text-slate-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
            GST, UPI, EPFO, Utility, and Bank telemetry have been successfully parsed. Active pipeline remains compliant with RBI standards.
          </p>

          <div className="mt-6 inline-flex gap-4 p-1.5 bg-slate-950/60 rounded-xl border border-slate-800/60">
            <div className="text-xs text-emerald-400 px-3 py-1.5 font-bold flex items-center gap-1 bg-slate-900 border border-slate-850 rounded-lg shadow-sm">
              <CheckCircle2 className="w-3.5 h-3.5" /> Pipeline Live
            </div>
            <button
              onClick={handleRevokeConsent}
              className="text-xs text-red-400 hover:text-red-300 px-3 py-1.5 font-bold hover:bg-red-950/20 rounded-lg transition-colors cursor-pointer"
              id="btn-revoke-consent"
            >
              Revoke Telemetry Consent
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
