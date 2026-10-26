import { AuditLogEntry, UserRole } from '../types';

class AuditService {
  private logs: AuditLogEntry[] = [
    {
      id: 'AUD-10001',
      timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
      actorRole: 'DPO_ADMIN',
      actorName: 'Dr. Evelyn Reed (Compliance Officer)',
      action: 'POLICY_UPDATE',
      resource: 'FERPA-POLICY-01',
      details: 'Reviewed and activated student directory disclosure restrictions for AY 2026.',
      ipAddress: '192.168.1.10',
      complianceStatus: 'COMPLIANT'
    },
    {
      id: 'AUD-10002',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      actorRole: 'DATA_STEWARD',
      actorName: 'Marcus Vance (Data Steward)',
      action: 'ETL_EXECUTE',
      resource: 'DATA_WAREHOUSE_SYNC',
      details: 'Scheduled batch sync executed for SIS, LMS, and Library sources.',
      ipAddress: '192.168.1.45',
      complianceStatus: 'COMPLIANT'
    }
  ];

  public log(entry: Omit<AuditLogEntry, 'id' | 'timestamp'>): AuditLogEntry {
    const newLog: AuditLogEntry = {
      id: `AUD-${Date.now().toString().slice(-6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    this.logs.unshift(newLog); // newest first
    return newLog;
  }

  public getAll(): AuditLogEntry[] {
    return this.logs;
  }

  public getSummary() {
    const total = this.logs.length;
    const breaches = this.logs.filter(l => l.complianceStatus === 'BREACH_ATTEMPT').length;
    const warnings = this.logs.filter(l => l.complianceStatus === 'WARNING').length;
    const compliant = this.logs.filter(l => l.complianceStatus === 'COMPLIANT').length;
    return { total, breaches, warnings, compliant };
  }
}

export const auditService = new AuditService();
