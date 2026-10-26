'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getPoliciesAPI } from '../../services/api';
import { BookOpen, ShieldCheck, CheckCircle2, Lock } from 'lucide-react';

export default function GovernancePage() {
  const { token } = useAuth();
  const [policies, setPolicies] = useState<any[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await getPoliciesAPI(token);
        if (res.data) setPolicies(res.data);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BookOpen className="w-7 h-7 text-indigo-600" />
          Institutional Data Governance Policy Catalog
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Regulatory policies defining confidentiality, accountability, and ethical data handling in university environments.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {policies.map((p) => (
          <div key={p.id} className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="text-xs font-mono font-bold text-indigo-600 uppercase">{p.id}</span>
                <h3 className="text-lg font-bold text-slate-900 mt-0.5">{p.title}</h3>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 self-start sm:self-auto">
                {p.standard}
              </span>
            </div>

            <p className="text-sm text-slate-600 mt-3 leading-relaxed">
              {p.description}
            </p>

            <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs font-semibold text-emerald-700">
              <CheckCircle2 className="w-4 h-4" />
              <span>Enforcement: {p.enforcementLevel}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
