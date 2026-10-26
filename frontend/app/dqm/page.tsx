'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDqmMetricsAPI, remediateDqmAPI } from '../../services/api';
import {
  ShieldCheck, Wrench, AlertTriangle, CheckCircle2,
  RefreshCw, Loader2, Lock, BarChart3, Zap, Activity,
} from 'lucide-react';

const dimDescriptions: Record<string, string> = {
  Completeness: 'Checks if critical attributes (SSN, Email, Department) are populated across all student records.',
  Validity: 'Validates RFC email syntax compliance and GPA boundary constraints (0.0 – 4.0).',
  Consistency: 'Ensures proper title casing for student names and standardized formatting across all departments.',
  Uniqueness: 'Prevents duplicate student registrations and primary key collisions in the master registry.',
};

function DimCard({ dim }: { dim: any }) {
  const isGood = dim.score >= 95;
  const isWarn = dim.score >= 70 && dim.score < 95;
  const colorClass = isGood ? 'emerald' : isWarn ? 'amber' : 'rose';
  const barColor = isGood
    ? 'from-emerald-400 to-emerald-500'
    : isWarn
    ? 'from-amber-400 to-amber-500'
    : 'from-rose-400 to-rose-500';

  return (
    <div className={`card p-5 border-t-4 border-t-${colorClass}-400 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {isGood
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : <AlertTriangle className={`w-4 h-4 text-${colorClass}-500`} />
          }
          <span className="font-bold text-slate-800">{dim.name}</span>
        </div>
        <div className="text-right">
          <span className={`badge bg-${colorClass}-100 text-${colorClass}-700 font-mono`}>
            {dim.score}%
          </span>
          <p className={`text-[10px] font-semibold text-${colorClass}-600 mt-0.5`}>{dim.status}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-4">
        {dimDescriptions[dim.name] || dim.description}
      </p>
      <div className="progress-bar">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${barColor} transition-all duration-700 ease-out`}
          style={{ width: `${dim.score}%` }}
        />
      </div>
      <div className="flex justify-between mt-1 text-[10px] text-slate-400">
        <span>0%</span>
        <span className="font-semibold">{dim.score}% achieved</span>
        <span>100%</span>
      </div>
    </div>
  );
}

function AnomalyRow({ a }: { a: any }) {
  return (
    <div className="flex items-center justify-between py-3.5 border-b border-slate-100 last:border-0 hover:bg-rose-50/30 transition-colors px-2 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-rose-100 flex items-center justify-center">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
        </div>
        <div>
          <p className="font-semibold text-sm text-slate-800">{a.name}</p>
          <p className="text-xs text-slate-400 font-mono">{a.studentNo} · {a.email}</p>
        </div>
      </div>
      <div className="flex flex-wrap gap-1.5 justify-end">
        {a.flags.map((f: string) => (
          <span key={f} className="badge bg-rose-100 text-rose-700 font-mono text-[10px]">
            {f}
          </span>
        ))}
      </div>
    </div>
  );
}

export default function DqmPage() {
  const { role, isAdmin, token } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [remediating, setRemediating] = useState(false);
  const [remediationMsg, setRemediationMsg] = useState<string | null>(null);
  const [remediationError, setRemediationError] = useState<string | null>(null);

  const isAuthorized = role === 'REGISTRAR' || role === 'ADMIN';

  const loadMetrics = async () => {
    setLoading(true);
    try {
      const res = await getDqmMetricsAPI(token);
      if (res.data) setMetrics(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMetrics(); }, [token]);

  const handleRemediate = async () => {
    setRemediating(true);
    setRemediationMsg(null);
    setRemediationError(null);
    try {
      const res = await remediateDqmAPI(token);
      setRemediationMsg(res.message || 'Auto-remediation pipeline executed successfully.');
      if (res.metrics) setMetrics(res.metrics);
      else await loadMetrics();
    } catch (err: any) {
      setRemediationError(err.message || 'Remediation pipeline failed.');
    } finally {
      setRemediating(false);
    }
  };

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <BarChart3 className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Data Quality Management (DQM) Workbench</h1>
          </div>
          <p className="text-sm text-slate-500 ml-8">
            Continuous auditing across Completeness, Validity, Consistency, and Uniqueness dimensions.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={loadMetrics}
            disabled={loading}
            className="btn-secondary py-2 px-3 text-xs"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          {isAuthorized ? (
            <button
              onClick={handleRemediate}
              disabled={remediating || loading}
              className="btn-primary"
            >
              {remediating
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Executing Pipeline...</>
                : <><Zap className="w-4 h-4" /> Run Auto-Remediation</>
              }
            </button>
          ) : (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 border border-slate-200 text-xs text-slate-500">
              <Lock className="w-3.5 h-3.5" />
              ADMIN / REGISTRAR only
            </div>
          )}
        </div>
      </div>

      {/* Remediation Result */}
      {remediationMsg && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 slide-in">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Auto-Remediation Complete</p>
            <p className="text-xs mt-0.5 text-emerald-700">{remediationMsg}</p>
          </div>
        </div>
      )}
      {remediationError && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 slide-in">
          <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Pipeline Error</p>
            <p className="text-xs mt-0.5 text-rose-700">{remediationError}</p>
          </div>
        </div>
      )}

      {/* Overall Health */}
      {metrics && (
        <div className="card p-5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <p className="text-indigo-200 text-xs font-semibold">Overall DQM Health Score</p>
                <p className="text-4xl font-extrabold font-mono">{metrics.overallHealthScore}%</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-indigo-200">Dimensions Evaluated</p>
              <p className="text-2xl font-bold">4</p>
              <p className="text-xs text-indigo-300 mt-0.5">Completeness · Validity · Consistency · Uniqueness</p>
            </div>
          </div>
          <div className="mt-4 bg-white/10 rounded-full h-2 overflow-hidden">
            <div
              className="h-full bg-white rounded-full transition-all duration-700"
              style={{ width: `${metrics.overallHealthScore}%` }}
            />
          </div>
        </div>
      )}

      {/* 4 Dimensions Grid */}
      <div>
        <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Quality Dimensions</h2>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="shimmer w-36 h-4 rounded mb-3" />
                <div className="shimmer w-full h-3 rounded mb-2" />
                <div className="shimmer w-full h-2 rounded mt-4" />
              </div>
            ))}
          </div>
        ) : metrics?.dimensions ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {metrics.dimensions.map((dim: any) => (
              <DimCard key={dim.name} dim={dim} />
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-12 text-slate-400">
            <ShieldCheck className="w-10 h-10 mb-3 opacity-20" />
            <p className="text-sm font-medium">No DQM data available</p>
            <p className="text-xs mt-1">Ensure the backend server is running</p>
          </div>
        )}
      </div>

      {/* Detected Anomalies */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Detected Data Anomalies
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Real-time scan results flagging incomplete, invalid, or non-standard records
            </p>
          </div>
          {metrics?.anomalies?.length > 0 && (
            <span className="badge bg-rose-100 text-rose-700">
              {metrics.anomalies.length} anomal{metrics.anomalies.length === 1 ? 'y' : 'ies'}
            </span>
          )}
        </div>

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <div className="flex gap-3">
                  <div className="shimmer w-8 h-8 rounded-lg" />
                  <div>
                    <div className="shimmer w-32 h-4 rounded mb-2" />
                    <div className="shimmer w-48 h-3 rounded" />
                  </div>
                </div>
                <div className="shimmer w-28 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : metrics?.anomalies?.length > 0 ? (
          <div>
            {metrics.anomalies.map((a: any) => (
              <AnomalyRow key={a.studentId} a={a} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-3" />
            <p className="font-bold text-emerald-800 text-sm">Zero Active Anomalies Detected</p>
            <p className="text-xs text-emerald-600 mt-1">All student records comply with institutional quality thresholds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
