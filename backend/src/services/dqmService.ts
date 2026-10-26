import { QualityIssue, SisRecord, LmsRecord, LibraryRecord } from '../types';
import { auditService } from './auditService';

export class DqmService {
  private issues: QualityIssue[] = [];

  public validateRawRecords(sis: SisRecord[], lms: LmsRecord[], library: LibraryRecord[]): QualityIssue[] {
    const detectedIssues: QualityIssue[] = [];
    const seenStudentIds = new Set<string>();

    sis.forEach(s => {
      // 1. Uniqueness check
      if (seenStudentIds.has(s.studentId)) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'studentId',
          issueType: 'DUPLICATE',
          severity: 'HIGH',
          description: `Duplicate Student ID collision detected (${s.studentId}). Possible dual registration or system sync anomaly.`,
          currentValue: s.studentId,
          suggestedFix: `${s.studentId} (Merge or Reassign)`,
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      } else {
        seenStudentIds.add(s.studentId);
      }

      // 2. Email format validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(s.email)) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'email',
          issueType: 'FORMAT_ERROR',
          severity: 'HIGH',
          description: `Invalid email address syntax: '${s.email}'. Will cause notification failures.`,
          currentValue: s.email,
          suggestedFix: s.email.replace('#', '@').replace('invalid_email.com', 'university.edu'),
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      }

      // 3. Name capitalization / formatting
      const isAllUpper = s.fullName === s.fullName.toUpperCase();
      const isAllLower = s.fullName === s.fullName.toLowerCase();
      const hasCommaFormat = s.fullName.includes(',');
      if (isAllUpper || isAllLower || hasCommaFormat) {
        let suggested = s.fullName;
        if (hasCommaFormat) {
          const parts = s.fullName.split(',').map(p => p.trim());
          suggested = `${parts[1]} ${parts[0]}`;
        }
        suggested = suggested
          .toLowerCase()
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'fullName',
          issueType: 'INCONSISTENCY',
          severity: 'MEDIUM',
          description: `Non-standard name format: '${s.fullName}'. Needs standard title case (First Last).`,
          currentValue: s.fullName,
          suggestedFix: suggested,
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      }

      // 4. Inconsistent program codes
      if (['BS CS', 'Computer Science'].includes(s.academicProgram)) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'academicProgram',
          issueType: 'INCONSISTENCY',
          severity: 'LOW',
          description: `Program code variation '${s.academicProgram}'. Standard university catalog designation is 'BS Computer Science'.`,
          currentValue: s.academicProgram,
          suggestedFix: 'BS Computer Science',
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      } else if (['BSIT', 'Information Technology'].includes(s.academicProgram)) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'academicProgram',
          issueType: 'INCONSISTENCY',
          severity: 'LOW',
          description: `Program code variation '${s.academicProgram}'. Standard university catalog designation is 'BS Information Technology'.`,
          currentValue: s.academicProgram,
          suggestedFix: 'BS Information Technology',
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      }

      // 5. Missing / incomplete contact data
      if (!s.phone || s.phone === 'N/A' || s.phone.length < 7) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'SIS',
          recordId: s.id,
          studentName: s.fullName,
          field: 'phone',
          issueType: 'MISSING_FIELD',
          severity: 'MEDIUM',
          description: `Missing mandatory student emergency contact number. Violates student welfare policy.`,
          currentValue: s.phone,
          suggestedFix: '+63-900-000-0000 (Prompt Student)',
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      }
    });

    // Check LMS Cross-system integrity
    lms.forEach(l => {
      const matchInSis = sis.find(s => s.studentId === l.studentRefId);
      if (!matchInSis) {
        detectedIssues.push({
          id: `ISSUE-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          source: 'LMS',
          recordId: l.id,
          studentName: l.studentNameOnLms,
          field: 'studentRefId',
          issueType: 'ANOMALY',
          severity: 'HIGH',
          description: `Orphan LMS account detected! Student ${l.studentRefId} (${l.studentNameOnLms}) has course activity but no matching SIS registrar record.`,
          currentValue: l.studentRefId,
          suggestedFix: 'Investigate SIS registrar enrollment status',
          status: 'PENDING',
          detectedAt: new Date().toISOString()
        });
      }
    });

    this.issues = detectedIssues;
    return this.issues;
  }

  public getIssues(): QualityIssue[] {
    return this.issues;
  }

  public resolveIssue(issueId: string, actorRole: string, actorName: string): QualityIssue | null {
    const issue = this.issues.find(i => i.id === issueId);
    if (!issue) return null;
    issue.status = 'RESOLVED';

    auditService.log({
      actorRole: actorRole as any,
      actorName,
      action: 'DQM_CLEANSE',
      resource: issue.field,
      details: `Resolved DQM defect '${issue.issueType}' on student '${issue.studentName}'. Before: ${issue.currentValue} -> Fixed with suggested standard.`,
      ipAddress: '192.168.1.45',
      complianceStatus: 'COMPLIANT'
    });

    return issue;
  }

  public calculateMetrics() {
    const total = this.issues.length;
    const resolved = this.issues.filter(i => i.status === 'RESOLVED').length;
    const pending = this.issues.filter(i => i.status === 'PENDING').length;
    const highSeverity = this.issues.filter(i => i.severity === 'HIGH' && i.status === 'PENDING').length;
    
    // Overall Health Index: 100 minus penalty for pending issues
    const penalty = pending * 6 + highSeverity * 10;
    const healthScore = Math.max(20, Math.min(100, 100 - penalty));

    return {
      total,
      resolved,
      pending,
      highSeverity,
      healthScore,
      dimensions: {
        completeness: 82,
        validity: 78,
        consistency: 74,
        uniqueness: 80
      }
    };
  }
}

export const dqmService = new DqmService();
