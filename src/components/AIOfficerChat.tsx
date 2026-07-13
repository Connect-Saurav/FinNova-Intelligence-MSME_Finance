import React, { useState } from 'react';
import { AIAnalysisResult, EnterpriseProfile, CreditScoreResult } from '../types';
import { Send, Sparkles, MessageSquare, AlertCircle, TrendingUp, CheckCircle, Lightbulb, User, ShieldAlert } from 'lucide-react';

interface AIOfficerChatProps {
  analysis: AIAnalysisResult | null;
  isLoading: boolean;
  onAnalyze: () => void;
  profile: EnterpriseProfile;
  calculatedScore: CreditScoreResult;
}

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function AIOfficerChat({ 
  analysis, 
  isLoading, 
  onAnalyze, 
  profile, 
  calculatedScore 
}: AIOfficerChatProps) {
  const [userMsg, setUserMsg] = useState('');
  const [chatHistory, setChatHistory] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userMsg.trim()) return;

    const currentMsg = userMsg;
    setUserMsg('');
    
    // Add user message to history
    const updatedHistory: Message[] = [...chatHistory, { role: 'user', text: currentMsg }];
    setChatHistory(updatedHistory);
    setIsChatLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentMsg,
          history: chatHistory,
          profile,
          calculatedScore
        })
      });

      const data = await response.json();
      if (response.ok) {
        setChatHistory(prev => [...prev, { role: 'model', text: data.text }]);
      } else {
        setChatHistory(prev => [...prev, { role: 'model', text: `Failed to communicate with AI officer: ${data.error || 'Server error'}` }]);
      }
    } catch (err: any) {
      setChatHistory(prev => [...prev, { role: 'model', text: `Connection error: ${err.message || 'Check your dev server'}` }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 shadow-xl" id="ai-officer-section">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b border-slate-800 pb-5 mb-6 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-teal-950/30 border border-teal-900/30 flex items-center justify-center text-teal-400">
            <Sparkles className="w-5 h-5 animate-pulse-glow" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-full text-[9px] font-extrabold bg-teal-950/30 text-teal-400 border border-teal-900/30 uppercase tracking-wider">FinNova AI Officer</span>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">Gemini Risk & Advisory Desk</h2>
          </div>
        </div>

        {!analysis && !isLoading && (
          <button
            onClick={onAnalyze}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:opacity-90 text-white font-bold text-xs tracking-tight transition-all border border-teal-500/30 shadow-md bento-glow-teal flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
            id="btn-run-ai-analysis"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-200" /> Launch AI Credit Review
          </button>
        )}
      </div>

      {isLoading && (
        <div className="py-12 text-center" id="ai-analysis-loading">
          <div className="relative w-14 h-14 mx-auto mb-5">
            <div className="absolute inset-0 rounded-full border-4 border-slate-900"></div>
            <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin"></div>
          </div>
          <h4 className="text-sm font-bold text-white">Synthesizing Alternate Ledger Footprints</h4>
          <p className="text-xs text-slate-400 mt-1 animate-pulse max-w-xs mx-auto leading-relaxed">
            Parsing GST Invoices, verifying EPFO pension delays, and conducting Account Aggregator flow audit...
          </p>
        </div>
      )}

      {!isLoading && !analysis && (
        <div className="py-12 text-center bg-slate-950/40 rounded-2xl border border-dashed border-slate-800" id="ai-analysis-placeholder">
          <MessageSquare className="w-10 h-10 text-slate-700 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-white">No Active AI Review Session</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Click the button above to authorize the Gemini AI Officer to run multi-dimensional financial evaluations and forecast eligibility ranges.
          </p>
        </div>
      )}

      {!isLoading && analysis && (
        <div className="space-y-6" id="ai-analysis-results">
          {/* Executive Summary callout */}
          <div className="bg-gradient-to-r from-teal-950/20 to-slate-900/40 border border-teal-500/20 rounded-xl p-5 bento-glow-teal animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-2 flex items-center gap-1.5 font-mono">
              <Lightbulb className="w-4 h-4 text-teal-400" /> Executive Credit Synthesis
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed font-normal">
              {analysis.executiveSummary}
            </p>
          </div>

          {/* 4 Key Dimensions Analysis Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 animate-fadeIn">
            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 shadow-sm">
              <span className="text-[9px] uppercase font-extrabold text-slate-500 font-mono tracking-wider block mb-1">Risk Evaluation & Signals</span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {analysis.riskEvaluation}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 shadow-sm">
              <span className="text-[9px] uppercase font-extrabold text-slate-500 font-mono tracking-wider block mb-1">Cash Flow Stability Review</span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {analysis.cashFlowStabilityAnalysis}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 shadow-sm">
              <span className="text-[9px] uppercase font-extrabold text-slate-500 font-mono tracking-wider block mb-1">Future Repayment Capacity</span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {analysis.repaymentCapacityAnalysis}
              </p>
            </div>

            <div className="border border-slate-800 bg-slate-950/30 rounded-2xl p-4 shadow-sm">
              <span className="text-[9px] uppercase font-extrabold text-slate-500 font-mono tracking-wider block mb-1">Scoring Rationale</span>
              <p className="text-slate-300 text-xs leading-relaxed">
                {analysis.scoreExplanation}
              </p>
            </div>
          </div>

          {/* Strategic Improvement Opportunities */}
          <div className="animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
              <TrendingUp className="w-3.5 h-3.5 text-emerald-400" /> Score Optimization Roadmap (Strategic Growth)
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {analysis.improvementSuggestions.map((item, idx) => (
                <div key={idx} className="bg-emerald-950/10 border border-emerald-900/30 p-4 rounded-xl relative overflow-hidden flex flex-col justify-between bento-glow-emerald">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950/50 text-emerald-400 border border-emerald-900/40 font-mono">
                        {item.area}
                      </span>
                      <span className="text-[10px] font-bold text-slate-500 font-mono">
                        {item.timeframe}
                      </span>
                    </div>
                    <p className="text-slate-300 text-xs leading-relaxed font-normal">
                      {item.actionableStep}
                    </p>
                  </div>

                  <div className="mt-3.5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[11px]">
                    <span className="text-slate-500 font-bold">Potential score gain</span>
                    <strong className="text-emerald-400 font-extrabold font-mono">+{item.impactOnScorePoints} Pts</strong>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversational AI Officer desk */}
          <div className="border-t border-slate-800 pt-6 mt-8 animate-fadeIn">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5 font-mono">
              <MessageSquare className="w-3.5 h-3.5 text-teal-400" /> Interactive Officer Consultation
            </h4>

            {/* Chat Box */}
            <div className="border border-slate-800 rounded-2xl bg-slate-950/40 overflow-hidden flex flex-col h-80">
              <div className="p-3.5 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Active Consultation with Risk Officer
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Queries logged securely</span>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 font-normal text-xs bg-slate-950/20" id="chat-messages-container">
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 max-w-sm mr-auto text-slate-300 leading-relaxed shadow-sm">
                  Hello! I am your AI Risk Officer. I have fully analyzed your alternative ledgers (GSTN, AA current balances, EPFO). Ask me anything about how we computed your {calculatedScore.overallScore} score, or request strategic tips to enhance your credit limit.
                </div>

                {chatHistory.map((msg, idx) => {
                  const isUser = msg.role === 'user';
                  return (
                    <div 
                      key={idx} 
                      className={`flex gap-2.5 max-w-sm rounded-xl p-3 leading-relaxed shadow-sm ${
                        isUser 
                          ? 'ml-auto bg-teal-600 border border-teal-500/30 text-white font-semibold' 
                          : 'mr-auto bg-slate-900/80 border border-slate-800 text-slate-300'
                      }`}
                    >
                      {!isUser && <Sparkles className="w-3.5 h-3.5 text-teal-400 mt-0.5 shrink-0" />}
                      <span>{msg.text}</span>
                    </div>
                  );
                })}

                {isChatLoading && (
                  <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 max-w-xs mr-auto flex items-center gap-2 text-slate-500 font-mono">
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                    <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    <span>Officer is reviewing guidelines...</span>
                  </div>
                )}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-800 bg-slate-900/80 flex gap-2">
                <input
                  type="text"
                  value={userMsg}
                  onChange={(e) => setUserMsg(e.target.value)}
                  placeholder="Ask a question (e.g. How can Narmada Agro leverage UPI flows?)"
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white focus:outline-teal-500 focus:border-teal-500/40 font-normal"
                  disabled={isChatLoading}
                />
                <button
                  type="submit"
                  disabled={!userMsg.trim() || isChatLoading}
                  className="p-2 bg-teal-600 hover:bg-teal-500 text-white rounded-lg border border-teal-500/30 shadow-sm transition-colors cursor-pointer disabled:bg-slate-850 disabled:text-slate-600 disabled:border-transparent disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
