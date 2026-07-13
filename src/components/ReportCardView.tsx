import React, { useState } from 'react';
import { CreditScoreResult, ScoreMetricBreakdown } from '../types';
import { ChevronDown, ChevronUp, Printer, CheckCircle2, AlertTriangle, HelpCircle, Shield, Stamp } from 'lucide-react';

interface ReportCardViewProps {
  enterpriseName: string;
  calculatedScore: CreditScoreResult;
  location: string;
  vintage: number;
}

export default function ReportCardView({ 
  enterpriseName, 
  calculatedScore, 
  location, 
  vintage 
}: ReportCardViewProps) {
  const [expandedMetric, setExpandedMetric] = useState<string | null>(null);

  const toggleMetric = (key: string) => {
    setExpandedMetric(prev => (prev === key ? null : key));
  };

  const parametersList = [
    { key: 'revenueGrowth', name: 'Revenue Growth', icon: '📈', weight: '20%' },
    { key: 'cashFlowStability', name: 'Cash Flow Stability', icon: '💰', weight: '20%' },
    { key: 'bankingBehaviour', name: 'Banking Behaviour', icon: '🏦', weight: '15%' },
    { key: 'gstCompliance', name: 'GST Compliance', icon: '📝', weight: '15%' },
    { key: 'digitalTransactions', name: 'Digital Transactions', icon: '⚡', weight: '10%' },
    { key: 'businessStability', name: 'Business Stability', icon: '🛡️', weight: '10%' },
    { key: 'operationalStrength', name: 'Operational Strength', icon: '👥', weight: '5%' },
    { key: 'financialDiscipline', name: 'Financial Discipline', icon: '⚖️', weight: '5%' }
  ];

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 lg:p-8 shadow-xl" id="financial-report-card">
      {/* Header bar styled like an official Indian Banking Certificate */}
      <div className="border-2 border-dashed border-teal-500/20 p-4 rounded-2xl mb-8 relative bg-slate-950/60">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-xs font-bold tracking-widest text-teal-400 uppercase">Unified Lending Interface (ULI)</h1>
            <h2 className="text-2xl font-extrabold text-white mt-0.5 tracking-tight">MSME FINANCIAL HEALTH CARD</h2>
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-3 mt-1.5 text-xs text-slate-400 font-mono">
              <span>REF ID: <strong className="text-slate-200">ULI-FIN-2026-{enterpriseName.substring(0,3).toUpperCase()}</strong></span>
              <span>•</span>
              <span>ISSUED BY: <strong className="text-slate-200">FinNova Intelligence Platform</strong></span>
            </div>
          </div>

          {/* Stamp/QR section */}
          <div className="flex items-center gap-4">
            <div className="border border-slate-800 p-1.5 rounded bg-slate-950 shrink-0">
              {/* Simple simulated SVG QR code */}
              <svg className="w-14 h-14 text-white" viewBox="0 0 100 100" fill="currentColor">
                <rect x="0" y="0" width="25" height="25" />
                <rect x="5" y="5" width="15" height="15" fill="#020617" />
                <rect x="75" y="0" width="25" height="25" />
                <rect x="80" y="5" width="15" height="15" fill="#020617" />
                <rect x="0" y="75" width="25" height="25" />
                <rect x="5" y="80" width="15" height="15" fill="#020617" />
                <rect x="35" y="35" width="30" height="30" />
                <rect x="40" y="40" width="20" height="20" fill="#020617" />
                {/* Random blocks */}
                <rect x="10" y="35" width="10" height="10" />
                <rect x="55" y="10" width="10" height="10" />
                <rect x="80" y="45" width="15" height="10" />
                <rect x="45" y="80" width="10" height="15" />
              </svg>
            </div>

            <div className="border border-teal-500/20 rounded-lg p-2 text-center bg-teal-950/20 min-w-24 shrink-0 font-mono text-[10px]">
              <span className="text-teal-400 font-bold block">VERIFIED AA</span>
              <span className="text-slate-500 block mt-0.5">DPDP Compliant</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Credit Evaluation Parameter Analysis</h3>
          <p className="text-xs text-slate-400">
            Weighted assessment parameters across 8 dimensions. Expand each metric to audit credit signals.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700/80 font-bold text-xs rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm self-start sm:self-center"
          id="btn-print-report"
        >
          <Printer className="w-3.5 h-3.5" /> Print Health Card
        </button>
      </div>

      {/* 8 Parameters table-like bento stack */}
      <div className="space-y-3.5">
        {parametersList.map((item) => {
          const metricData = calculatedScore[item.key as keyof CreditScoreResult] as ScoreMetricBreakdown;
          if (!metricData) return null;

          const isExpanded = expandedMetric === item.key;

          let riskBg = 'bg-red-950/30 text-red-400 border-red-900/50';
          if (metricData.riskStatus === 'Low Risk') {
            riskBg = 'bg-emerald-950/30 text-emerald-400 border-emerald-900/50';
          } else if (metricData.riskStatus === 'Moderate Risk') {
            riskBg = 'bg-teal-950/30 text-teal-400 border-teal-900/50';
          } else if (metricData.riskStatus === 'Elevated Risk') {
            riskBg = 'bg-amber-950/30 text-amber-400 border-amber-900/50';
          }

          return (
            <div 
              key={item.key} 
              className="border border-slate-800/85 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 bg-slate-950/20 hover:bg-slate-950/40 transition-all"
              id={`report-metric-${item.key}`}
            >
              <div 
                onClick={() => toggleMetric(item.key)}
                className="p-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h4 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                      {item.name} <span className="text-[11px] text-slate-500 font-mono font-medium">(Weight: {item.weight})</span>
                    </h4>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-none">
                      Weighted score Contribution: <strong className="text-slate-300 font-bold">{metricData.weightedContribution.toFixed(1)}</strong> points
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Score & Grade */}
                  <div className="text-right">
                    <span className="text-white font-extrabold text-sm font-mono">{metricData.score}</span>
                    <span className="text-slate-500 text-xs font-mono font-medium">/100</span>
                    <span className="ml-2.5 px-2 py-0.5 rounded text-[10px] font-black bg-slate-800 text-slate-300 border border-slate-700/80 font-mono">
                      {metricData.grade}
                    </span>
                  </div>

                  {/* Risk Tag */}
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border hidden sm:inline-block ${riskBg}`}>
                    {metricData.riskStatus}
                  </span>

                  {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-slate-900 bg-slate-950/40 p-4 animate-slideDown">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Strengths */}
                    <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-850">
                      <h5 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-2.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Positive Risk Signals (Strengths)
                      </h5>
                      {metricData.strengths.length > 0 ? (
                        <ul className="space-y-2">
                          {metricData.strengths.map((s, idx) => (
                            <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-1 flex items-start gap-1.5">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-slate-500 italic">No significant positive compliance features identified in this sector.</p>
                      )}
                    </div>

                    {/* Weaknesses */}
                    <div className="bg-slate-900/40 p-3.5 rounded-lg border border-slate-850">
                      <h5 className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1 mb-2.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-400" /> Warning Credit Signals (Risks)
                      </h5>
                      {metricData.weaknesses.length > 0 ? (
                        <ul className="space-y-2">
                          {metricData.weaknesses.map((w, idx) => (
                            <li key={idx} className="text-xs text-slate-300 leading-relaxed pl-1 flex items-start gap-1.5">
                              <span className="text-amber-400 font-bold">•</span>
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-xs text-emerald-400 font-bold">✓ Exceptional hygiene: No active warning signs recorded.</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Official Bankers Signature co-branded section */}
      <div className="border-t border-slate-800 pt-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6 text-center md:text-left">
        <div>
          <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">System Authenticity</span>
          <p className="text-xs text-slate-400 font-mono mt-1 leading-relaxed">
            Data sourced directly via RBI AA licensed Consent Pipeline. Audit trail logged securely under reference code: <strong className="text-slate-200">AA-DPDP-STAMP-2026</strong>.
          </p>
        </div>

        <div className="flex flex-col items-center md:items-start justify-center">
          <div className="text-xs text-slate-400 flex items-center gap-1 font-mono">
            <Shield className="w-3.5 h-3.5 text-indigo-400" />
            <span>DPG India Standard V2</span>
          </div>
          <span className="text-[9px] text-slate-500 block mt-1">Interoperable with ULI & OCEN protocol standards</span>
        </div>

        <div className="flex flex-col items-center md:items-end justify-center">
          <div className="border-2 border-dashed border-slate-800 p-2 text-center rounded-lg max-w-44 select-none relative bg-slate-950/60">
            <span className="text-[10px] font-serif italic text-indigo-400 block font-bold">DIGITAL COMPLIANCE STAMP</span>
            <span className="text-[8px] text-slate-500 block font-mono mt-0.5">UPI/GSTN SECURE ENGINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}
