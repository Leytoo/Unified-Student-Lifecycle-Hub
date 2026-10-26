import { Router } from 'express';
import { getDqmMetrics, remediateAnomalies } from '../controllers/dataQualityController';
import { requireRole } from '../middlewares/authMiddleware';
import { UserRole } from '../constants';

const router = Router();

router.get('/metrics', getDqmMetrics);
router.post('/remediate', requireRole([UserRole.REGISTRAR, UserRole.ADMIN]), remediateAnomalies);

export default router;
