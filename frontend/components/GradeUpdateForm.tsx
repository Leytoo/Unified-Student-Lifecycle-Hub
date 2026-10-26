'use client';

import React, { useState, useEffect } from 'react';
import { updateGradeAPI, getGradesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck, AlertCircle, CheckCircle2, Lock,
  GraduationCap, ChevronDown, Loader2, Send,
} from 'lucide-react';

function AccessDeniedBanner({ role }: { role: string }) {
  return (
    <div className="flex items-start gap-4 p-5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800">
      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center flex-shrink-0">
        <Lock className="w-5 h-5 text-rose-600" />
      </div>
      <div>
        <p className="font-bold text-sm">Governance Policy RBAC-04 — Access Denied</p>
        <p className="text-xs mt-1 text-rose-700 leading-relaxed">
          Your current role is <code className="bg-rose-100 px-1 py-0.5 rounded font-mono">{role}</code>.
          Only <strong>FACULTY</strong>, <strong>REGISTRAR</strong>, or <strong>ADMIN</strong> roles may commit grade alterations.
        </p>
        <p className="text-xs mt-2 text-rose-600">
          → Switch your role in the top navigation bar to gain access.
        </p>
      </div>
    </div>
  );
}

function AuditBadge({ audit }: { audit: any }) {
  if (!audit) return null;
  return (
    <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl font-mono text-[11px] text-emerald-700 space-y-1">
      <p className="font-bold text-emerald-800 mb-2 flex items-center gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5" />
        Audit Log Written
      </p>
      {audit.id && <p>ID: <span className="text-emerald-600">{audit.id}</span></p>}
      {audit.action && <p>Action: <span className="text-emerald-600">{audit.action}</span></p>}
      {audit.timestamp && <p>Timestamp: <span className="text-emerald-600">{new Date(audit.timestamp).toLocaleString()}</span></p>}
    </div>
  );
}

export default function GradeUpdateForm() {
  const { role, token, canSubmitGrades } = useAuth();
  const [enrollmentId, setEnrollmentId] = useState('');
  const [grade, setGrade] = useState('');
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [status, setStatus] = useState<{ type: 'success' | 'error'; text: string; audit?: any } | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingEnrollments, setLoadingEnrollments] = useState(true);

  const gradeNum = parseFloat(grade);
  const isGradeValid = !isNaN(gradeNum) && gradeNum >= 0.0 && gradeNum <= 4.0;
  const isGradeOutOfRange = !isNaN(gradeNum) && (gradeNum < 0.0 || gradeNum > 4.0);

  const loadEnrollments = async () => {
    setLoadingEnrollments(true);
    try {
      const res = await getGradesAPI(token);
      if (res.data && res.data.length > 0) {
        setEnrollments(res.data);
        setEnrollmentId(res.data[0].id);
        setGrade(res.data[0].grade?.toString() || '3.50');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingEnrollments(false);
    }
  };

  useEffect(() => {
    loadEnrollments();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    if (!isGradeValid) {
      setStatus({ type: 'error', text: 'DQM Rule Violation: Grade must be a numeric value between 0.0 and 4.0.' });
      return;
    }

    setLoading(true);
    try {
      const result = await updateGradeAPI(enrollmentId, gradeNum, token);
      setStatus({
        type: 'success',
        text: result.message || 'Grade successfully committed to the immutable audit trail.',
        audit: result.audit,
      });
      await loadEnrollments();
    } catch (err: any) {
      setStatus({ type: 'error', text: err.message || 'Submission rejected by Governance / DQM guard.' });
    } finally {
      setLoading(false);
    }
  };

  const selectedEnrollment = enrollments.find(e => e.id === enrollmentId);

  return (
    <div className="card overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900">Faculty Grade Entry Portal</h2>
              <p className="text-xs text-slate-500 mt-0.5">RBAC + Zod DQM bounds enforcement (0.0 – 4.0)</p>
            </div>
          </div>
          <span className={`badge ${canSubmitGrades ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
            {canSubmitGrades ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
            {canSubmitGrades ? 'Access Granted' : 'Role Restricted'}
          </span>
        </div>
      </div>

      <div className="p-6 space-y-5">
        {/* Access Denied */}
        {!canSubmitGrades && <AccessDeniedBanner role={role} />}

        {/* Status Alert */}
        {status && (
          <div className={`flex items-start gap-3 p-4 rounded-xl border ${
            status.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}>
            {status.type === 'error'
              ? <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              : <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
            }
            <div className="text-sm flex-1">
              <p className="font-semibold">{status.text}</p>
              <AuditBadge audit={status.audit} />
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Student & Enrollment */}
          <div>
            <label className="form-label">
              Select Student & Course Enrollment
              <span className="text-xs font-normal text-slate-400 ml-2">(UUID Reference)</span>
            </label>
            <div className="relative">
              {loadingEnrollments ? (
                <div className="form-input flex items-center gap-2 text-slate-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading enrollments...
                </div>
              ) : (
                <>
                  <select
                    value={enrollmentId}
                    onChange={(e) => {
                      setEnrollmentId(e.target.value);
                      const match = enrollments.find(item => item.id === e.target.value);
                      if (match && match.grade !== null) setGrade(match.grade.toString());
                    }}
                    disabled={!canSubmitGrades || loading}
                    className="form-input appearance-none pr-10 disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {enrollments.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.studentName} — {e.courseTitle} · Grade: {e.grade ?? 'Pending'} [{e.id.slice(0, 8)}…]
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </>
              )}
            </div>
            {selectedEnrollment && (
              <p className="text-xs text-slate-400 mt-1.5 font-mono">
                UUID: {enrollmentId}
              </p>
            )}
          </div>

          {/* Grade Input */}
          <div>
            <label className="form-label">
              Student Grade
              <span className="text-xs font-normal text-slate-400 ml-2">DQM Allowed Range: 0.0 – 4.0</span>
            </label>
            <input
              type="number"
              step="0.05"
              min="0"
              max="4"
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              placeholder="e.g. 3.75"
              disabled={!canSubmitGrades || loading}
              required
              className={`form-input font-mono disabled:opacity-60 disabled:cursor-not-allowed ${
                isGradeOutOfRange ? 'border-rose-300 bg-rose-50 focus:ring-rose-500/30 focus:border-rose-400' : ''
              }`}
            />
            {isGradeOutOfRange && (
              <p className="text-xs text-rose-600 mt-1.5 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                Out-of-range value will be rejected by both client-side DQM guard and server-side Zod validation.
              </p>
            )}
            {!isNaN(gradeNum) && isGradeValid && (
              <div className="mt-2">
                <div className="flex justify-between text-[10px] text-slate-400 mb-1">
                  <span>0.0</span>
                  <span className="font-semibold text-indigo-600">{gradeNum.toFixed(2)}</span>
                  <span>4.0</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-indigo-400 to-indigo-600 transition-all duration-300"
                    style={{ width: `${(gradeNum / 4.0) * 100}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={!canSubmitGrades || loading || !isGradeValid}
            className="btn-primary w-full justify-center py-3"
          >
            {loading ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Validating & Committing...</>
            ) : (
              <><Send className="w-4 h-4" /> Submit Governed Grade Update</>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
