'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getStudentsAPI } from '../../services/api';
import {
  Users, Eye, EyeOff, ShieldAlert, CheckCircle2,
  RefreshCw, GraduationCap, Mail, Hash,
} from 'lucide-react';

function PiiBadge({ masked }: { masked: boolean }) {
  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
      masked
        ? 'bg-amber-50 text-amber-700 border-amber-200'
        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
    }`}>
      {masked ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
      <span>{masked ? 'PII Obfuscated (FERPA Restricted)' : 'Full PII Access (Authorized)'}</span>
    </div>
  );
}

function GpaBadge({ gpa }: { gpa: number }) {
  const color =
    gpa >= 3.5 ? 'bg-emerald-100 text-emerald-700' :
    gpa >= 2.5 ? 'bg-blue-100 text-blue-700' :
    gpa >= 1.0 ? 'bg-amber-100 text-amber-700' :
    'bg-rose-100 text-rose-700';
  return (
    <span className={`badge font-mono font-bold ${color}`}>
      {gpa.toFixed(2)}
    </span>
  );
}

function DqmBadge({ status }: { status: string }) {
  const isClean = status === 'CLEAN' || status === 'REMEDIATED';
  return (
    <span className={`badge ${
      isClean ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
    }`}>
      {isClean ? <CheckCircle2 className="w-3 h-3" /> : <ShieldAlert className="w-3 h-3" />}
      {status}
    </span>
  );
}

function MaskedValue({ value, masked }: { value: string; masked: boolean }) {
  if (!masked) return <span className="font-mono text-xs text-slate-800 font-semibold">{value}</span>;
  return (
    <span className="font-mono text-xs text-slate-400 tracking-widest select-none">
      {value}
    </span>
  );
}

export default function StudentsPage() {
  const { role, isFullPiiAccess } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await getStudentsAPI(role);
        if (res.data) setStudents(res.data);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [role, refreshKey]);

  return (
    <div className="space-y-6 fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-6 h-6 text-indigo-600" />
            <h1 className="text-2xl font-extrabold text-slate-900">Unified Student 360 Records</h1>
          </div>
          <p className="text-sm text-slate-500">
            Dynamic FERPA compliance: Sensitive PII obfuscated unless viewing as{' '}
            <strong className="text-slate-700">REGISTRAR</strong> or{' '}
            <strong className="text-slate-700">ADMIN</strong>.
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <PiiBadge masked={!isFullPiiAccess} />
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="btn-secondary py-1.5 px-3 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
        </div>
      </div>

      {/* Role Info Banner */}
      {!isFullPiiAccess && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
          <ShieldAlert className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">FERPA Restriction Active — Role: {role}</p>
            <p className="text-xs mt-0.5 text-amber-700">
              SSN and Phone fields are masked per 20 U.S.C. § 1232g. Switch to REGISTRAR or ADMIN to view full PII.
            </p>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <div className="divide-y divide-slate-100">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4">
                <div className="shimmer w-28 h-4 rounded" />
                <div className="shimmer w-40 h-4 rounded" />
                <div className="shimmer w-32 h-4 rounded" />
                <div className="shimmer w-12 h-4 rounded" />
                <div className="shimmer w-24 h-4 rounded" />
                <div className="shimmer w-24 h-4 rounded" />
                <div className="shimmer w-20 h-6 rounded-full" />
              </div>
            ))}
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-400">
            <Users className="w-12 h-12 mb-3 opacity-20" />
            <p className="font-semibold text-sm">No student records found</p>
            <p className="text-xs mt-1">Ensure backend is running on port 5000</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full data-table">
              <thead>
                <tr>
                  <th>
                    <div className="flex items-center gap-1.5">
                      <Hash className="w-3.5 h-3.5" /> Student No.
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Name & Email
                    </div>
                  </th>
                  <th>Department & Level</th>
                  <th>GPA</th>
                  <th>
                    <div className="flex items-center gap-1.5">
                      {!isFullPiiAccess && <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                      SSN (FERPA)
                    </div>
                  </th>
                  <th>
                    <div className="flex items-center gap-1.5">
                      {!isFullPiiAccess && <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
                      Phone
                    </div>
                  </th>
                  <th>DQM Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-lg font-semibold">
                        {s.studentNo}
                      </span>
                    </td>
                    <td>
                      <p className="font-semibold text-slate-800">{s.firstName} {s.lastName}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span className="text-xs text-slate-500">{s.email}</span>
                      </div>
                    </td>
                    <td>
                      <p className="text-slate-700 font-medium text-xs">{s.department}</p>
                      <span className="text-[10px] text-slate-400">Year {s.yearLevel}</span>
                    </td>
                    <td><GpaBadge gpa={s.gpa} /></td>
                    <td><MaskedValue value={s.ssn} masked={s._piiMasked} /></td>
                    <td><MaskedValue value={s.phone} masked={s._piiMasked} /></td>
                    <td><DqmBadge status={s.dqmStatus} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Record Count Footer */}
      {!loading && students.length > 0 && (
        <p className="text-xs text-slate-400 text-right">
          {students.length} records · FERPA Compliance: {isFullPiiAccess ? '✅ Full Access' : '🔒 PII Masked'}
        </p>
      )}
    </div>
  );
}
