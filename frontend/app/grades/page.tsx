'use client';

import React from 'react';
import GradeUpdateForm from '../../components/GradeUpdateForm';
import { GraduationCap, ShieldAlert, Users, Lock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const specs = [
  {
    icon: Users,
    title: 'Role-Based Access Control',
    content: 'Only users with FACULTY, REGISTRAR, or ADMIN role may submit grades. STUDENT submissions are intercepted client-side and rejected server-side with HTTP 403 Forbidden.',
    color: 'text-indigo-600 bg-indigo-100',
  },
  {
    icon: ShieldAlert,
    title: 'DQM Data Quality Bounds',
    content: 'Zod schema mandates numeric values strictly within 0.0 ≤ grade ≤ 4.0. Negative values or grades exceeding 4.0 are rejected at both client-side and server-side validation layers.',
    color: 'text-amber-600 bg-amber-100',
  },
  {
    icon: CheckCircle2,
    title: 'Forensic Audit Trail',
    content: 'Every successful submission creates an immutable record capturing acting user, student ID, previous grade, new grade, and ISO 8601 timestamp.',
    color: 'text-emerald-600 bg-emerald-100',
  },
];

export default function GradesPage() {
  const { canSubmitGrades, role } = useAuth();

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <GraduationCap className="w-6 h-6 text-indigo-600" />
          <h1 className="text-2xl font-extrabold text-slate-900">Faculty Grade Entry & Evaluation</h1>
        </div>
        <p className="text-sm text-slate-500 ml-8">
          Client-side DQM pre-validation + server-side Zod schema enforcement (0.0–4.0 bounds) with immutable forensic audit logging.
        </p>
      </div>

      {/* Role Banner */}
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium ${
        canSubmitGrades
          ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
          : 'bg-rose-50 border-rose-200 text-rose-800'
      }`}>
        {canSubmitGrades ? <CheckCircle2 className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
        Current Role: <code className="font-mono font-bold">{role}</code>
        {canSubmitGrades
          ? ' — Grade submission is authorized for this role.'
          : ' — Grade submission is blocked. Switch to FACULTY, REGISTRAR, or ADMIN.'}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          <GradeUpdateForm />
        </div>

        {/* Specs Sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2 mb-4">
              <ShieldAlert className="w-4 h-4 text-indigo-600" />
              Governance & DQM Specifications
            </h3>
            <div className="space-y-4">
              {specs.map((spec, i) => (
                <div key={i} className="flex gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${spec.color}`}>
                    <spec.icon className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-800">{spec.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{spec.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-5 bg-gradient-to-br from-indigo-50 to-violet-50/50 border-indigo-100">
            <p className="text-xs font-bold text-indigo-800 mb-2">Grade Scale Reference</p>
            {[
              { range: '3.5 – 4.0', label: 'Distinction / A', color: 'bg-emerald-500' },
              { range: '2.5 – 3.4', label: 'Merit / B', color: 'bg-blue-500' },
              { range: '1.0 – 2.4', label: 'Pass / C', color: 'bg-amber-500' },
              { range: '0.0 – 0.9', label: 'Fail / F', color: 'bg-rose-500' },
            ].map((g) => (
              <div key={g.range} className="flex items-center gap-2 py-1.5 border-b border-indigo-100 last:border-0">
                <div className={`w-2 h-2 rounded-full ${g.color}`} />
                <span className="font-mono text-xs text-indigo-700 font-semibold w-20">{g.range}</span>
                <span className="text-xs text-slate-600">{g.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
