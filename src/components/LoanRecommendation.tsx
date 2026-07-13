import React, { useState, useEffect } from 'react';
import { AIAnalysisResult } from '../types';
import { Landmark, Percent, Calendar, ShieldCheck, DollarSign, Calculator, ChevronRight } from 'lucide-react';

interface LoanRecommendationProps {
  analysis: AIAnalysisResult | null;
  overallScore: number;
}

export default function LoanRecommendation({ analysis, overallScore }: LoanRecommendationProps) {
  const isEligible = overallScore >= 600;
  const maxLoan = analysis?.eligibilityDecision?.maxRecommendedLoanAmountLakhs || 
                  (overallScore >= 800 ? 15.0 : overallScore >= 700 ? 10.0 : overallScore >= 600 ? 5.0 : 0);
  const ratePercent = analysis?.eligibilityDecision?.predictedInterestRatePercent || 
                      (overallScore >= 900 ? 9.5 : overallScore >= 800 ? 11.2 : overallScore >= 700 ? 13.5 : 15.5);
  const suggestedTenure = analysis?.eligibilityDecision?.suggestedTenureMonths || 24;

  const [selectedAmountLakhs, setSelectedAmountLakhs] = useState(maxLoan);
  const [selectedTenure, setSelectedTenure] = useState(suggestedTenure);

  // Sync state if max loan changes
  useEffect(() => {
    setSelectedAmountLakhs(maxLoan);
  }, [maxLoan]);

  useEffect(() => {
    setSelectedTenure(suggestedTenure);
  }, [suggestedTenure]);

  if (!isEligible) {
    return (
      <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 text-center shadow-xl" id="loan-recommendation-block">
        <div className="w-12 h-12 rounded-full bg-red-950/40 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-900/40">
          <Landmark className="w-6 h-6 animate-pulse" />
        </div>
        <h3 className="text-lg font-bold text-white">Unsecured Credit Limit Currently Suspended</h3>
        <p className="text-slate-400 text-xs mt-1.5 max-w-md mx-auto leading-relaxed">
          Due to credit parameters falling below the minimum threshold (Score: {overallScore}/1000), unsecured automatic limits are unavailable.
          Refer to the <strong className="text-white font-bold">AI Officer Suggestions</strong> to improve GST compliance or maintain cash balances to unlock micro-borrowing options.
        </p>
      </div>
    );
  }

  // Calculate EMI: Monthly payment = [P x r x (1+r)^n] / [(1+r)^n - 1]
  const principal = selectedAmountLakhs * 100000; // 1 Lakh = 100,000 INR
  const monthlyRate = (ratePercent / 12) / 100;
  const numMonths = selectedTenure;
  
  let emi = 0;
  if (monthlyRate > 0) {
    emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, numMonths)) / (Math.pow(1 + monthlyRate, numMonths) - 1);
  } else {
    emi = principal / numMonths;
  }

  // Generate personalized amortization table
  const amortizationSchedule: Array<{
    month: number;
    emi: number;
    principalPaid: number;
    interestPaid: number;
    remainingBalance: number;
  }> = [];

  let balance = principal;
  for (let i = 1; i <= numMonths; i++) {
    const interest = balance * monthlyRate;
    const princPaid = emi - interest;
    balance = Math.max(0, balance - princPaid);
    
    amortizationSchedule.push({
      month: i,
      emi,
      principalPaid: princPaid,
      interestPaid: interest,
      remainingBalance: balance
    });
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 lg:p-8 shadow-xl animate-fadeIn" id="loan-recommendation-block">
      <div className="border-b border-slate-800 pb-5 mb-6">
        <h3 className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 font-mono mb-1">Pre-approved limits</h3>
        <h2 className="text-xl font-bold text-white tracking-tight">Loan Recommendation & Repayment Engine</h2>
        <p className="text-slate-400 text-xs mt-1">
          Adjust loan principal and choose your tenure. Our risk-pricing engine updates estimated rates dynamically.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left and Middle controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sliders */}
          <div className="bg-slate-950/40 rounded-2xl p-5 border border-slate-850 shadow-inner">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase">Select Loan Principal</span>
                <span className="text-sm font-bold text-teal-400 font-mono">{selectedAmountLakhs.toFixed(1)} Lakhs</span>
              </div>
              <input
                type="range"
                min="0.5"
                max={maxLoan}
                step="0.1"
                value={selectedAmountLakhs}
                onChange={(e) => setSelectedAmountLakhs(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-teal-500"
              />
              <div className="flex justify-between text-[10px] text-slate-500 mt-1.5 font-bold font-mono">
                <span>Min: ₹50,000</span>
                <span>Pre-Approved Max: {formatCurrency(maxLoan * 100000)}</span>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-slate-400 uppercase block mb-2">Select Tenure Options</span>
              <div className="grid grid-cols-3 gap-3">
                {[12, 24, 36].map((months) => (
                  <button
                    key={months}
                    onClick={() => setSelectedTenure(months)}
                    className={`py-2.5 rounded-xl text-xs font-bold font-mono tracking-tight transition-all cursor-pointer border ${
                      selectedTenure === months 
                        ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white border-teal-500/30 shadow-md bento-glow-teal' 
                        : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border-slate-800'
                    }`}
                  >
                    {months} Months
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* EMI summary blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-teal-950/40 text-teal-400 flex items-center justify-center shrink-0 border border-teal-900/40">
                <Calculator className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-extrabold font-mono uppercase tracking-wider block">Monthly EMI</span>
                <strong className="text-white font-extrabold font-mono text-sm">{formatCurrency(emi)} / Month</strong>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-900/40">
                <Percent className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-extrabold font-mono uppercase tracking-wider block">Risk-adjusted ROI</span>
                <strong className="text-emerald-400 font-extrabold font-mono text-sm">{ratePercent.toFixed(2)}% p.a.</strong>
              </div>
            </div>

            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
              <div className="w-9 h-9 rounded-lg bg-amber-950/40 text-amber-400 flex items-center justify-center shrink-0 border border-amber-900/40">
                <Calendar className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[9px] text-slate-500 font-extrabold font-mono uppercase tracking-wider block">Total Repayment</span>
                <strong className="text-white font-extrabold font-mono text-sm">{formatCurrency(emi * selectedTenure)}</strong>
              </div>
            </div>
          </div>

          {/* Lender Match list */}
          <div>
            <h4 className="text-[9px] font-extrabold tracking-wider text-slate-500 font-mono uppercase mb-3">Best Co-Branded Lender Matches</h4>
            <div className="space-y-2.5">
              {(analysis?.eligibilityDecision?.bestLenderMatches || [
                { bankName: 'SBI MSME Assist', reason: 'Primary cash flow ledger; zero additional compliance documentation needed.', suitabilityScore: 95 },
                { bankName: 'SIDBI Venture Loan', reason: 'Favorable rates for EPFO registered manufacturing setups.', suitabilityScore: 88 }
              ]).map((lender, idx) => (
                <div key={idx} className="border border-slate-800/80 bg-slate-950/20 p-3.5 rounded-2xl flex items-center justify-between gap-4 shadow-sm hover:border-slate-700 transition-all">
                  <div>
                    <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-teal-950/50 text-teal-400 border border-teal-900/40 font-mono">
                      Score: {lender.suitabilityScore}% Match
                    </span>
                    <h5 className="font-bold text-white text-xs mt-1.5">{lender.bankName}</h5>
                    <p className="text-[11px] text-slate-400 mt-1">{lender.reason}</p>
                  </div>
                  <button className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-teal-400 rounded-lg transition-colors border border-slate-800 shrink-0 cursor-pointer">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Repayment amortization Schedule */}
        <div className="border border-slate-800 rounded-2xl bg-slate-950/40 overflow-hidden flex flex-col h-[400px] shadow-sm">
          <div className="p-4 bg-slate-900/80 border-b border-slate-800">
            <span className="text-[9px] font-extrabold uppercase tracking-wider text-slate-500 font-mono">Amortization Schedule</span>
            <h4 className="font-bold text-white text-xs mt-0.5">Dynamic Repayment Table</h4>
          </div>

          <div className="flex-1 overflow-y-auto font-mono text-[11px] bg-slate-950/10">
            <table className="w-full text-left">
              <thead className="bg-slate-900/60 sticky top-0 text-slate-500 font-extrabold border-b border-slate-800">
                <tr>
                  <th className="p-2 text-center">Mo.</th>
                  <th className="p-2">Principal</th>
                  <th className="p-2">Interest</th>
                  <th className="p-2">Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900 text-slate-350">
                {amortizationSchedule.map((row) => (
                  <tr key={row.month} className="hover:bg-slate-900/40">
                    <td className="p-2 text-center font-bold text-white">{row.month}</td>
                    <td className="p-2">{formatCurrency(row.principalPaid)}</td>
                    <td className="p-2">{formatCurrency(row.interestPaid)}</td>
                    <td className="p-2 font-medium text-slate-200">{formatCurrency(row.remainingBalance)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-center">
            <span className="text-[10px] text-slate-500 flex items-center justify-center gap-1 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Standard amortization ledger rules apply.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
