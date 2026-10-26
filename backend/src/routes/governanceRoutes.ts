import { Router } from 'express';
import { getPolicies, getAuditLogs } from '../controllers/governanceController';

const router = Router();

router.get('/policies', getPolicies);
router.get('/audit-logs', getAuditLogs);

export default router;
