'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  ShieldCheck,
  FileText,
  BookOpen,
  ShieldAlert,
  Sparkles,
  Database,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { ROLE_LABELS } from '../constants';

const navItems = [
  { href: '/', label: 'Overview Hub', icon: LayoutDashboard, description: 'Dashboard & Metrics' },
  { href: '/students', label: 'Student 360 & PII', icon: Users, description: 'FERPA Records' },
  { href: '/grades', label: 'Faculty Grade Entry', icon: GraduationCap, description: 'Grade Governance' },
  { href: '/dqm', label: 'DQM Workbench', icon: ShieldCheck, description: 'Quality Management' },
  { href: '/audit', label: 'Audit Trail', icon: FileText, description: 'Compliance Ledger' },
  { href: '/governance', label: 'Governance Policies', icon: BookOpen, description: 'Policy Catalog' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { role } = useAuth();
  const roleInfo = ROLE_LABELS[role];

  return (
    <aside
      className="w-64 flex flex-col min-h-screen sticky top-0 h-screen"
      style={{ background: 'linear-gradient(180deg, #0d1117 0%, #0a0f1e 100%)', borderRight: '1px solid rgba(255,255,255,0.06)' }}
    >
      {/* Logo */}
      <div className="p-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Database className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-white font-bold text-sm leading-none">EduGov Hub</p>
            <p className="text-slate-500 text-[10px] mt-0.5 leading-none">EDM & DQM System</p>
          </div>
        </div>
      </div>

      {/* Active Profile */}
      <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <p className="text-[10px] uppercase font-semibold text-slate-600 tracking-widest mb-2">Active Governance Profile</p>
        <div className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white/5 border" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-violet-500/30 border border-indigo-500/30 flex items-center justify-center">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">{roleInfo.title}</p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${roleInfo.color}`}>
              {roleInfo.badge}
            </span>
          </div>
        </div>
        {/* Live status */}
        <div className="flex items-center gap-1.5 mt-2 px-1">
          <div className="pulse-dot" />
          <span className="text-[10px] text-slate-500">System Active</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] uppercase font-semibold text-slate-600 tracking-widest mb-3 px-2">Navigation</p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600/25 text-white border border-indigo-500/30 shadow-sm shadow-indigo-500/10'
                  : 'text-slate-400 hover:text-white hover:bg-white/8'
              }`}
              style={!isActive ? {} : {}}
            >
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all ${
                isActive ? 'bg-indigo-500/30' : 'bg-white/5 group-hover:bg-white/10'
              }`}>
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-300' : 'text-slate-500 group-hover:text-slate-300'}`} />
              </div>
              <div className="min-w-0">
                <p className="leading-none truncate">{item.label}</p>
                <p className={`text-[10px] mt-0.5 leading-none truncate ${isActive ? 'text-indigo-400' : 'text-slate-600 group-hover:text-slate-500'}`}>
                  {item.description}
                </p>
              </div>
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-600/10 to-violet-600/10 border border-indigo-500/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-xs font-semibold text-indigo-300">FERPA & ISO 8000</span>
          </div>
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Enterprise Data Quality & Governance Engine v2.0
          </p>
        </div>
      </div>
    </aside>
  );
}
