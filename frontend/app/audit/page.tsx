'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getAuditLogsAPI } from '../../services/api';
import {
  FileText, Clock, User, Target,
  GraduationCap, Shield, Wrench, RefreshCw, Download,
  AlertTriangle, CheckCircle2,
} from 'lucide-react';

const ACTION_CONFIG: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  GRADE_UPDATE: { icon: GraduationCap, color: 'text-indigo-700', bg: 'bg-indigo-100' },
  PII_ACCESS: { icon: Shield, color: 'text-violet-700', bg: 'bg-violet-100' },
  REMEDIATION_RUN: { icon: Wrench, color: 'text-emerald-700', bg: 'bg-emerald-100' },
  ACCESS_DENIED: { icon: AlertTriangle, color: 'text-rose-700', bg: 'bg-rose-100' },
};

function getActionConfig(action: string) {
  for (const [key, config] of Object.entries(ACTION_CONFIG)) {
    if (action.includes(key)) return config;
  }
  if (action.includes('DENIED')) return ACTION_CONFIG.ACCESS_DENIED;
  return { icon: CheckCircle2, color: 'text-slate-700', bg: 'bg-slate-100' };
}

function ActionBadge({ action }: { action: string }) {
  const isError = action.includes('DENIED') || action.includes('FORBIDDEN');
  const isGrade = action.includes('GRADE');
  const isPii = action.includes('PII');
  const isRemediation = action.includes('REMEDIATION');

  const cls = isError
    ? 'bg-rose-100 text-rose-700'
    : isGrade
    ? 'bg-indigo-100 text-indigo-700'
    : isPii
    ? 'bg-violet-100 text-violet-700'
    : isRemediation
    ? 'bg-emerald-100 text-emerald-700'
    : 'bg-slate-100 text-slate-700';

  return (
    <span className={`badge font-mono text-[10px] ${cls}`}>
      {action}
    </span>
  );
}

function LogRow({ log, index }: { log: any; index: number }) {
  const config = getActionConfig(log.action);
  const Icon = config.icon;

  return (
    <div
      className="flex gap-4 p-4 hover:bg-slate-50/60 transition-colors duration-100 border-b border-slate-100 last:border-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div className={`w-9 h-9 rounded-xl ${config.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
        <Icon className={`w-4 h-4 ${config.color}`} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-wrap items-center gap-2 mb-1">
          <ActionBadge action={log.action} />
          <span className="text-[10px] text-slate-400 font-mono">#{log.id}</span>
        </div>
        <p className="text-sm text-slate-800 font-medium leading-snug">{log.details}</p>

        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>
              <span className="font-semibold text-slate-700">{log.userId}</span>
              <span className="ml-1 text-slate-400">({log.userRole})</span>
            </span>
          </div>
          {log.targetId && (
            <div className="flex items-center gap-1">
              <Target className="w-3 h-3" />
              <code className="bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-mono text-slate-600">
                {log.targetId}
              </code>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span className="font-mono text-[11px]">{new Date(log.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuditPage() {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterAction, setFilterAction] = useState('ALL');

  const loadLogs = async () => {
    setLoading(true);
    try {
      const res = await getAuditLogsAPI(token);
      if (res.data) setLogs(res.data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadLogs(); }, [token]);

  const filtered = filterAction === 'ALL'
    ? logs
    : logs.filter(l => l.action.includes(filterAction));

  const handleExport = () => {
    const json = JSON.stringify(filtered, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-trail-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const actionTypes = ['ALL', 'GRADE', 'PII', 'REMEDIATION', 'DENIED'];

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FileText className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Compliance Audit Trail</h1>
          </div>
          <p className="text-sm text-slate-500 ml-8">
            Immutable forensic ledger — every grade submission, PII access, and remediation event.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button onClick={loadLogs} disabled={loading} className="btn-secondary py-2 px-3 text-xs">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
          <button onClick={handleExport} disabled={filtered.length === 0} className="btn-secondary py-2 px-3 text-xs">
            <Download className="w-3.5 h-3.5" /> Export JSON
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Entries', value: logs.length, color: 'text-indigo-600' },
          { label: 'Grade Updates', value: logs.filter(l => l.action.includes('GRADE')).length, color: 'text-blue-600' },
          { label: 'Access Events', value: logs.filter(l => l.action.includes('PII')).length, color: 'text-violet-600' },
          { label: 'Denied / Errors', value: logs.filter(l => l.action.includes('DENIED')).length, color: 'text-rose-600' },
        ].map((stat) => (
          <div key={stat.label} className="card p-4">
            <p className={`text-2xl font-extrabold font-mono ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-slate-500 font-medium mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filter */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Filter:</span>
        {actionTypes.map((type) => (
          <button
            key={type}
            onClick={() => setFilterAction(type)}
            className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-all duration-150 ${
              filterAction === type
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300 hover:text-indigo-600'
            }`}
          >
            {type}
          </button>
        ))}
        {filterAction !== 'ALL' && (
          <span className="text-xs text-slate-400">{filtered.length} results</span>
        )}
      </div>

      {/* Log Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex gap-4 p-4">
                <div className="shimmer w-9 h-9 rounded-xl" />
                <div className="flex-1">
                  <div className="shimmer w-36 h-4 rounded mb-2" />
                  <div className="shimmer w-full h-3 rounded mb-2" />
                  <div className="shimmer w-64 h-3 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <FileText className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-semibold text-sm">No audit records found</p>
            <p className="text-xs mt-1">
              {filterAction !== 'ALL' ? 'Try changing the filter.' : 'Ensure the backend server is running.'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtered.map((log, i) => (
              <LogRow key={log.id} log={log} index={i} />
            ))}
          </div>
        )}
      </div>

      {!loading && filtered.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          Showing {filtered.length} of {logs.length} immutable audit records · Export available
        </p>
      )}
    </div>
  );
}
