import React from 'react';
import { CreditScoreResult } from '../types';
import { Award, AlertTriangle, ShieldCheck, HeartPulse } from 'lucide-react';

interface ScoreGaugeProps {
  calculatedScore: CreditScoreResult;
}

export default function ScoreGauge({ calculatedScore }: ScoreGaugeProps) {
  const { overallScore, grade, riskCategory } = calculatedScore;

  // Circular gauge calculations
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  // Let's create a semi-circle or full arc. A 3/4 circle is stunning for dials.
  // We will do a nice 280-degree dial.
  const strokeDashoffset = circumference - (overallScore / 1000) * circumference;

  let scoreColorClass = 'text-red-400';
  let scoreBgClass = 'bg-red-950/40 text-red-400 border-red-800/50';
  let gaugeGradientId = 'gauge-red';

  if (overallScore >= 900) {
    scoreColorClass = 'text-emerald-400';
    scoreBgClass = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/50';
    gaugeGradientId = 'gauge-emerald';
  } else if (overallScore >= 800) {
    scoreColorClass = 'text-green-400';
    scoreBgClass = 'bg-green-950/40 text-green-400 border-green-800/50';
    gaugeGradientId = 'gauge-green';
  } else if (overallScore >= 700) {
    scoreColorClass = 'text-teal-400';
    scoreBgClass = 'bg-teal-950/40 text-teal-400 border-teal-800/50';
    gaugeGradientId = 'gauge-teal';
  } else if (overallScore >= 600) {
    scoreColorClass = 'text-amber-400';
    scoreBgClass = 'bg-amber-950/40 text-amber-400 border-amber-800/50';
    gaugeGradientId = 'gauge-amber';
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 flex flex-col items-center justify-center text-center relative shadow-xl bento-glow-teal" id="score-gauge-card">
      <div className="absolute top-4 right-4">
        <span className="p-1 rounded-full bg-slate-950/80 text-slate-500 block border border-slate-800" title="Alternative Scoring Engine">
          <HeartPulse className="w-4 h-4 text-teal-500 animate-pulse" />
        </span>
      </div>

      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">Multidimensional Health Score</span>

      {/* SVG Arc Gauge */}
      <div className="relative w-48 h-48 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90">
          <defs>
            <linearGradient id="gauge-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="gauge-green" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="100%" stopColor="#16a34a" />
            </linearGradient>
            <linearGradient id="gauge-teal" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#2dd4bf" />
              <stop offset="100%" stopColor="#0d9488" />
            </linearGradient>
            <linearGradient id="gauge-amber" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <linearGradient id="gauge-red" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
          </defs>
          {/* Base track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="stroke-slate-850/80 fill-none"
            strokeWidth="12"
          />
          {/* Progress track */}
          <circle
            cx="96"
            cy="96"
            r={radius}
            className="fill-none transition-all duration-1000 ease-out"
            stroke={`url(#${gaugeGradientId})`}
            strokeWidth="12"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>

        {/* Center values */}
        <div className="absolute inset-0 flex flex-col items-center justify-center mt-2">
          <span className={`text-4xl font-extrabold tracking-tight font-mono ${scoreColorClass}`}>
            {overallScore}
          </span>
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">/ 1000</span>
          
          <div className="mt-3">
            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase font-mono ${scoreBgClass}`}>
              {grade}
            </span>
          </div>
        </div>
      </div>

      <div className="w-full border-t border-slate-800 pt-5 mt-3">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-left pl-2">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Risk Grade</span>
            <div className="flex items-center gap-1 mt-1">
              {riskCategory === 'Minimal Risk' || riskCategory === 'Low Risk' ? (
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              )}
              <span className="font-extrabold text-white text-sm tracking-tight">{riskCategory}</span>
            </div>
          </div>

          <div className="text-left pl-2 border-l border-slate-800">
            <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">ULI Status</span>
            <div className="flex items-center gap-1 mt-1">
              <Award className="w-4 h-4 text-teal-400" />
              <span className="font-extrabold text-white text-sm tracking-tight">
                {overallScore >= 600 ? 'Pre-Approved' : 'Review Req.'}
              </span>
            </div>
          </div>
        </div>

        {/* Score threshold bar */}
        <div className="mt-5 text-left">
          <div className="flex justify-between text-[8px] text-slate-500 uppercase font-black mb-1 font-mono">
            <span>High Risk (&lt;600)</span>
            <span>Fair (600+)</span>
            <span>Good (700+)</span>
            <span>Excellent (900+)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-950 rounded-full flex overflow-hidden border border-slate-900">
            <div className="h-full bg-red-500/80" style={{ width: '60%' }} />
            <div className="h-full bg-amber-500/80" style={{ width: '10%' }} />
            <div className="h-full bg-teal-500/80" style={{ width: '20%' }} />
            <div className="h-full bg-emerald-400" style={{ width: '10%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
