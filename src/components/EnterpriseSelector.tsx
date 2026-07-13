import React, { useState } from 'react';
import { EnterpriseProfile } from '../types';
import { mockProfiles } from '../data/profiles';
import { Settings, FileEdit, Check, Landmark, RefreshCw, Sparkles, AlertCircle } from 'lucide-react';

interface EnterpriseSelectorProps {
  selectedProfile: EnterpriseProfile;
  onProfileSelect: (profile: EnterpriseProfile) => void;
  onProfileUpdate: (updatedProfile: EnterpriseProfile) => void;
}

export default function EnterpriseSelector({ 
  selectedProfile, 
  onProfileSelect, 
  onProfileUpdate 
}: EnterpriseSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  
  // Local edit states
  const [editedName, setEditedName] = useState(selectedProfile.name);
  const [editedVintage, setEditedVintage] = useState(selectedProfile.vintageYears);
  const [editedChequeBounces, setEditedChequeBounces] = useState(selectedProfile.aa.chequeBounces6Months);
  const [editedLateGst, setEditedLateGst] = useState(selectedProfile.gst.lateFilingsCount3Years);
  const [editedMinBalViolations, setEditedMinBalViolations] = useState(selectedProfile.aa.minimumBalanceViolations6Months);
  const [editedEmployees, setEditedEmployees] = useState(selectedProfile.epfo.activeEmployeesCount);
  const [editedUtilityLate, setEditedUtilityLate] = useState(selectedProfile.utility.electricityLatePayments6Months);
  const [editedGstScore, setEditedGstScore] = useState(selectedProfile.gst.gstComplianceScore);
  const [editedCashRatio, setEditedCashRatio] = useState(selectedProfile.aa.cashWithdrawalRatio);

  // Sync edits when selected profile changes
  React.useEffect(() => {
    setEditedName(selectedProfile.name);
    setEditedVintage(selectedProfile.vintageYears);
    setEditedChequeBounces(selectedProfile.aa.chequeBounces6Months);
    setEditedLateGst(selectedProfile.gst.lateFilingsCount3Years);
    setEditedMinBalViolations(selectedProfile.aa.minimumBalanceViolations6Months);
    setEditedEmployees(selectedProfile.epfo.activeEmployeesCount);
    setEditedUtilityLate(selectedProfile.utility.electricityLatePayments6Months);
    setEditedGstScore(selectedProfile.gst.gstComplianceScore);
    setEditedCashRatio(selectedProfile.aa.cashWithdrawalRatio);
  }, [selectedProfile]);

  const handleApplyChanges = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: EnterpriseProfile = {
      ...selectedProfile,
      name: editedName,
      vintageYears: Number(editedVintage),
      gst: {
        ...selectedProfile.gst,
        lateFilingsCount3Years: Number(editedLateGst),
        gstComplianceScore: Number(editedGstScore)
      },
      aa: {
        ...selectedProfile.aa,
        chequeBounces6Months: Number(editedChequeBounces),
        minimumBalanceViolations6Months: Number(editedMinBalViolations),
        cashWithdrawalRatio: Number(editedCashRatio)
      },
      epfo: {
        ...selectedProfile.epfo,
        activeEmployeesCount: Number(editedEmployees)
      },
      utility: {
        ...selectedProfile.utility,
        electricityLatePayments6Months: Number(editedUtilityLate)
      }
    };
    onProfileUpdate(updated);
    setIsEditing(false);
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm rounded-3xl border border-slate-800 p-6 shadow-xl" id="enterprise-selector-container">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-teal-400 mb-1 flex items-center gap-1.5">
            <Landmark className="w-3.5 h-3.5 text-teal-500" /> FinNova alternate credit assessment engine
          </h3>
          <h2 className="text-xl font-bold text-white tracking-tight">Active Enterprise Portfolio</h2>
        </div>

        {/* Quick select buttons */}
        <div className="flex flex-wrap gap-2">
          {mockProfiles.map((p) => {
            const isSelected = p.id === selectedProfile.id;
            return (
              <button
                key={p.id}
                onClick={() => onProfileSelect(p)}
                className={`px-4 py-2 rounded-xl text-xs font-bold tracking-tight transition-all cursor-pointer border ${
                  isSelected 
                    ? 'bg-teal-600 text-white border-teal-500/30 shadow-md bento-glow-teal' 
                    : 'bg-slate-950/80 hover:bg-slate-800 text-slate-300 border-slate-800/80'
                }`}
                id={`btn-select-profile-${p.id}`}
              >
                {p.id === 'rajesh-garments' && 'Rajesh (Excellent)'}
                {p.id === 'saraswati-it' && 'Saraswati (Very Good)'}
                {p.id === 'narmada-agro' && 'Narmada (Good / NTC)'}
                {p.id === 'karan-metal' && 'Karan Metals (High Risk)'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Profile info cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-xl bg-slate-950/60 border border-slate-800/60">
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Legal Name</span>
          <p className="font-semibold text-white text-xs truncate mt-0.5" title={selectedProfile.name}>
            {selectedProfile.name}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Constitution & Segment</span>
          <p className="font-semibold text-white text-xs truncate mt-0.5">
            {selectedProfile.constitution} • {selectedProfile.segment}
          </p>
        </div>
        <div>
          <span className="text-[10px] uppercase font-bold text-slate-500">Location & Vintage</span>
          <p className="font-semibold text-white text-xs truncate mt-0.5">
            {selectedProfile.location} ({selectedProfile.vintageYears} Yrs)
          </p>
        </div>
        <div className="flex items-center justify-end">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="px-3.5 py-1.5 rounded-lg border border-slate-800 hover:border-slate-750 text-slate-300 bg-slate-900 hover:bg-slate-850 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            id="btn-toggle-edit-alternate-data"
          >
            <FileEdit className="w-3.5 h-3.5 text-slate-400" />
            {isEditing ? 'Close Editor' : 'Adjust Telemetry'}
          </button>
        </div>
      </div>

      {selectedProfile.id === 'narmada-agro' && (
        <div className="mt-3 bg-emerald-950/20 border border-emerald-900/40 rounded-lg p-3 text-[11px] text-emerald-300 flex gap-2">
          <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>New-to-Credit Spotlight:</strong> Narmada Agro has zero credit history (No EMIs/debits). In traditional models, they are rejected instantly. Our alternate flow scores them <strong>Good</strong> based on solid UPI flow and EPFO contributions.
          </span>
        </div>
      )}

      {isEditing && (
        <form onSubmit={handleApplyChanges} className="mt-6 border-t border-slate-800 pt-6 animate-fadeIn" id="telemetry-edit-form">
          <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-1.5">
            <Settings className="w-4 h-4 text-indigo-400" /> Adjust Credit Risk Signals & Telemetry
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Company Trade Name</label>
              <input
                type="text"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Vintage (Years)</label>
              <input
                type="number"
                value={editedVintage}
                onChange={(e) => setEditedVintage(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="50"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cheque Bounces (6 Months)</label>
              <input
                type="number"
                value={editedChequeBounces}
                onChange={(e) => setEditedChequeBounces(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="10"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">GST Late Filings (3 Years)</label>
              <input
                type="number"
                value={editedLateGst}
                onChange={(e) => setEditedLateGst(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="36"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Min Balance Violations (6M)</label>
              <input
                type="number"
                value={editedMinBalViolations}
                onChange={(e) => setEditedMinBalViolations(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="6"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Active EPFO Employees</label>
              <input
                type="number"
                value={editedEmployees}
                onChange={(e) => setEditedEmployees(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="500"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Utility Late Settlements (6M)</label>
              <input
                type="number"
                value={editedUtilityLate}
                onChange={(e) => setEditedUtilityLate(Math.max(0, Number(e.target.value)))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="6"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">GST Baseline Compliance (0-100)</label>
              <input
                type="number"
                value={editedGstScore}
                onChange={(e) => setEditedGstScore(Math.min(100, Math.max(0, Number(e.target.value))))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="100"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Cash Outflow Ratio (0.0 - 1.0)</label>
              <input
                type="number"
                step="0.05"
                value={editedCashRatio}
                onChange={(e) => setEditedCashRatio(Math.min(1.0, Math.max(0.0, Number(e.target.value))))}
                className="w-full text-xs px-3 py-2 border border-slate-800 rounded-lg text-white bg-slate-950 focus:outline-indigo-500 focus:border-indigo-500/50"
                min="0"
                max="1"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-lg font-bold text-xs text-slate-400 bg-slate-800 hover:bg-slate-700 transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg font-bold text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all cursor-pointer border border-emerald-500/30 shadow-md bento-glow-emerald flex items-center gap-1"
              id="btn-apply-telemetry-edits"
            >
              <Check className="w-3.5 h-3.5" /> Recompute Health Score
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
