import { Router, Request, Response } from 'express';
import { auditService } from '../services/auditService';

const router = Router();

// Get all audit logs
router.get('/', (_req: Request, res: Response) => {
  const logs = auditService.getAll();
  const summary = auditService.getSummary();
  res.json({ success: true, summary, data: logs });
});

// Post a custom audit log event (e.g. client-side export or security action)
router.post('/log', (req: Request, res: Response) => {
  const { action, resource, details, actorRole, actorName, complianceStatus } = req.body;
  const ipAddress = req.ip || '127.0.0.1';

  const entry = auditService.log({
    actorRole: actorRole || 'STUDENT_VIEWER',
    actorName: actorName || 'Unknown Actor',
    action: action || 'READ',
    resource: resource || 'GENERAL_SYSTEM',
    details: details || 'No details provided',
    ipAddress,
    complianceStatus: complianceStatus || 'COMPLIANT'
  });

  res.json({ success: true, data: entry });
});

export default router;
