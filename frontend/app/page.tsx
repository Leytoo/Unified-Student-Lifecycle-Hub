'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { getDqmMetricsAPI, getStudentsAPI, getAuditLogsAPI } from '../services/api';
import {
  ShieldCheck,
  Users,
  GraduationCap,
  FileText,
  ArrowRight,
  CheckCircle2,
  Lock,
  TrendingUp,
  AlertTriangle,
  Activity,
  Zap,
  BarChart3,
  Shield,
} from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color, href }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  sub: string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className={`stat-card group cursor-default ${href ? 'cursor-pointer' : ''}`}>
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color} transition-transform duration-200 group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
        {href && <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-500 transition-colors duration-150" />}
      </div>
      <div>
        <p className="text-2xl font-extrabold text-slate-900 font-mono">{value}</p>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mt-0.5">{label}</p>
      </div>
      <p className="text-xs text-slate-400">{sub}</p>
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function DimCard({ dim }: { dim: any }) {
  const isGood = dim.score >= 95;
  const isWarning = dim.score >= 70 && dim.score < 95;

  return (
    <div className={`card p-5 border-l-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
      isGood ? 'border-l-emerald-500' : isWarning ? 'border-l-amber-500' : 'border-l-rose-500'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {isGood ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          )}
          <span className="font-bold text-sm text-slate-800">{dim.name}</span>
        </div>
        <span className={`badge font-mono ${
          isGood
            ? 'bg-emerald-100 text-emerald-700'
            : isWarning
            ? 'bg-amber-100 text-amber-700'
            : 'bg-rose-100 text-rose-700'
        }`}>
          {dim.score}% · {dim.status}
        </span>
      </div>
      <p className="text-xs text-slate-500 mb-3 leading-relaxed">{dim.description}</p>
      <div className="progress-bar">
        <div
          className={`h-2 rounded-full transition-all duration-700 ease-out ${
            isGood ? 'bg-gradient-to-r from-emerald-400 to-emerald-500' :
            isWarning ? 'bg-gradient-to-r from-amber-400 to-amber-500' :
            'bg-gradient-to-r from-rose-400 to-rose-500'
          }`}
          style={{ width: `${dim.score}%` }}
        />
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="card p-5">
      <div className="shimmer w-10 h-10 rounded-xl mb-4" />
      <div className="shimmer w-20 h-7 rounded mb-2" />
      <div className="shimmer w-32 h-3 rounded" />
    </div>
  );
}

export default function DashboardPage() {
  const { role } = useAuth();
  const [metrics, setMetrics] = useState<any>(null);
  const [studentsCount, setStudentsCount] = useState<number>(0);
  const [auditCount, setAuditCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [dqmRes, stuRes, auditRes] = await Promise.all([
          getDqmMetricsAPI(role).catch(() => ({ data: null })),
          getStudentsAPI(role).catch(() => ({ data: [] })),
          getAuditLogsAPI(role).catch(() => ({ count: 0, data: [] }))
        ]);
        if (dqmRes.data) setMetrics(dqmRes.data);
        if (stuRes.data) setStudentsCount(stuRes.data.length);
        const count = auditRes.count ?? auditRes.data?.length ?? 0;
        setAuditCount(count);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [role]);

  return (
    <div className="space-y-8 fade-in">

      {/* ── Hero Banner ── */}
      <div className="relative rounded-2xl overflow-hidden hero-gradient p-8 shadow-xl shadow-indigo-900/20">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -right-20 -top-20 w-72 h-72 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute -left-10 bottom-0 w-48 h-48 rounded-full bg-indigo-400/10 blur-2xl" />
        </div>

        <div className="relative max-w-3xl">
          <div className="flex items-center gap-2 mb-4">
            <span className="badge bg-indigo-500/25 text-indigo-200 border border-indigo-400/25 text-[11px]">
              <Activity className="w-3 h-3" />
              Active Governance & Quality Management System
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
            Unified Student Lifecycle
            <span className="block text-indigo-300">Management System</span>
          </h1>

          <p className="mt-3 text-indigo-200/80 text-sm leading-relaxed max-w-2xl">
            Enterprise architecture demonstrating <strong className="text-white">Data Governance</strong> (FERPA RBAC,
            Immutable Audit Trails) and <strong className="text-white">Data Quality Management</strong> (Completeness,
            Validity, Consistency, Uniqueness) across all university systems.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/grades"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-indigo-900 font-semibold text-sm rounded-xl hover:bg-indigo-50 transition-all duration-150 shadow-lg shadow-black/20"
            >
              <GraduationCap className="w-4 h-4" />
              Faculty Grade Entry
            </Link>
            <Link
              href="/dqm"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-all duration-150 backdrop-blur-sm"
            >
              <ShieldCheck className="w-4 h-4" />
              DQM Workbench
            </Link>
            <Link
              href="/audit"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-medium text-sm rounded-xl border border-white/20 transition-all duration-150 backdrop-blur-sm"
            >
              <FileText className="w-4 h-4" />
              Audit Trail
            </Link>
          </div>
        </div>
      </div>

      {/* ── Metric Cards ── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">System Metrics</h2>
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <div className="pulse-dot scale-75" />
            Live
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)
          ) : (
            <>
              <StatCard
                icon={ShieldCheck}
                label="DQM Health Score"
                value={metrics ? `${metrics.overallHealthScore}%` : '—'}
                sub="Across 4 Quality Dimensions"
                color="bg-indigo-100 text-indigo-600"
                href="/dqm"
              />
              <StatCard
                icon={Users}
                label="Master Student Records"
                value={studentsCount}
                sub="Protected by FERPA Masking"
                color="bg-blue-100 text-blue-600"
                href="/students"
              />
              <StatCard
                icon={FileText}
                label="Audit Ledger Entries"
                value={auditCount}
                sub="Immutable Governance Trail"
                color="bg-violet-100 text-violet-600"
                href="/audit"
              />
              <StatCard
                icon={Lock}
                label="Active Role Privilege"
                value={role}
                sub="Switch in top navbar to test RBAC"
                color="bg-amber-100 text-amber-600"
              />
            </>
          )}
        </div>
      </div>

      {/* ── DQM Dimensions ── */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-bold text-slate-900">4-Tier Data Quality Dimensions (DQM)</h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 ml-7">Live evaluation of academic records integrity across all university data silos</p>
          </div>
          <Link href="/dqm" className="btn-secondary text-xs py-2 px-3">
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="card p-5">
                <div className="shimmer w-full h-4 rounded mb-3" />
                <div className="shimmer w-3/4 h-3 rounded mb-4" />
                <div className="shimmer w-full h-2 rounded" />
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
          <div className="flex flex-col items-center justify-center py-12 text-slate-400">
            <Shield className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">DQM data unavailable</p>
            <p className="text-xs mt-1">Ensure the backend server is running on port 5000</p>
          </div>
        )}
      </div>

      {/* ── Quick Links ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { href: '/students', icon: Users, title: 'Student 360 Records', desc: 'Inspect FERPA-masked PII based on your current role.', color: 'from-blue-500/10 to-blue-600/5 border-blue-200/50', iconColor: 'text-blue-600 bg-blue-100' },
          { href: '/dqm', icon: Zap, title: 'Run Auto-Remediation', desc: 'Execute the DQM pipeline to fix casing and data anomalies.', color: 'from-indigo-500/10 to-indigo-600/5 border-indigo-200/50', iconColor: 'text-indigo-600 bg-indigo-100' },
          { href: '/audit', icon: TrendingUp, title: 'Compliance Audit Trail', desc: 'Browse the immutable forensic ledger of all system events.', color: 'from-violet-500/10 to-violet-600/5 border-violet-200/50', iconColor: 'text-violet-600 bg-violet-100' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className={`group card p-5 bg-gradient-to-br ${item.color} border hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${item.iconColor} group-hover:scale-110 transition-transform duration-200`}>
              <item.icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-sm text-slate-800 group-hover:text-indigo-700 transition-colors">{item.title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            <div className="flex items-center gap-1 mt-3 text-xs font-semibold text-indigo-500 group-hover:gap-2 transition-all duration-150">
              Explore <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
