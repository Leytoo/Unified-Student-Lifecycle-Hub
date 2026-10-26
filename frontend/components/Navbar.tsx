'use client';

import React from 'react';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { UserRole, ROLE_LABELS } from '../constants';
import { GraduationCap, UserCog, ChevronRight, ShieldCheck } from 'lucide-react';

const roleIcons: Record<UserRole, string> = {
  [UserRole.STUDENT]: '🎓',
  [UserRole.FACULTY]: '👨‍🏫',
  [UserRole.REGISTRAR]: '📋',
  [UserRole.ADMIN]: '⚡',
};

const roleColors: Record<UserRole, string> = {
  [UserRole.STUDENT]: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20',
  [UserRole.FACULTY]: 'bg-blue-500/10 text-blue-400 border-blue-500/20 hover:bg-blue-500/20',
  [UserRole.REGISTRAR]: 'bg-purple-500/10 text-purple-400 border-purple-500/20 hover:bg-purple-500/20',
  [UserRole.ADMIN]: 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500/20',
};

const roleActiveColors: Record<UserRole, string> = {
  [UserRole.STUDENT]: 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/30',
  [UserRole.FACULTY]: 'bg-blue-500 text-white border-blue-500 shadow-blue-500/30',
  [UserRole.REGISTRAR]: 'bg-purple-500 text-white border-purple-500 shadow-purple-500/30',
  [UserRole.ADMIN]: 'bg-amber-500 text-white border-amber-500 shadow-amber-500/30',
};

export default function Navbar() {
  const { role, setRole } = useAuth();
  const roleInfo = ROLE_LABELS[role];

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-50">
      <div className="px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="hidden sm:flex w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 items-center justify-center shadow-md shadow-indigo-500/30 flex-shrink-0">
            <GraduationCap className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0 hidden sm:block">
            <Link href="/" className="font-bold text-base text-slate-900 leading-none hover:text-indigo-600 transition-colors duration-150">
              Unified Student Lifecycle Hub
            </Link>
            <div className="flex items-center gap-1.5 mt-0.5">
              <ShieldCheck className="w-3 h-3 text-indigo-500" />
              <p className="text-[10px] text-slate-400 font-medium">Data Governance & DQM System</p>
            </div>
          </div>
        </div>

        {/* Role Switcher */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
            <UserCog className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
            <span className="text-xs font-semibold text-slate-500 hidden sm:block whitespace-nowrap">Simulate Role</span>
            <ChevronRight className="w-3 h-3 text-slate-400 hidden sm:block" />
            <div className="flex gap-1">
              {Object.values(UserRole).map((r) => {
                const isActive = role === r;
                return (
                  <button
                    key={r}
                    onClick={() => setRole(r)}
                    title={ROLE_LABELS[r].badge}
                    className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all duration-150 ${
                      isActive
                        ? `${roleActiveColors[r]} shadow-sm`
                        : `${roleColors[r]}`
                    }`}
                  >
                    <span className="hidden sm:inline">{roleIcons[r]}</span>
                    {r}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Role Badge */}
          <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-slate-900 rounded-xl">
            <div className="pulse-dot" />
            <span className="text-xs font-medium text-white">{roleInfo.title}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
