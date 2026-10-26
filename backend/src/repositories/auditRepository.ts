import { db, AuditLog } from '../lib/db';
import { UserRole } from '../constants';

export class AuditRepository {
  findAll(): AuditLog[] {
    return [...db.auditLogs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  log(entry: {
    userId: string;
    userRole: UserRole;
    action: string;
    targetId: string;
    details: string;
    metadata?: Record<string, any>;
  }): AuditLog {
    const record: AuditLog = {
      id: `audit-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...entry
    };
    db.auditLogs.unshift(record);
    return record;
  }
}

export const auditRepository = new AuditRepository();
