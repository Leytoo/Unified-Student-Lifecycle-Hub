import { Router, Request, Response } from 'express';
import { etlService } from '../services/etlService';
import { UserRole } from '../types';

const router = Router();

// Run ETL pipeline
router.post('/run', (req: Request, res: Response) => {
  try {
    const role = (req.headers['x-user-role'] as UserRole) || 'DATA_STEWARD';
    const actorName = (req.headers['x-user-name'] as string) || 'Marcus Vance (Data Steward)';
    const clientIp = req.ip || '127.0.0.1';

    const result = etlService.runPipeline(role, actorName, clientIp);
    res.json({ success: true, ...result });
  } catch (error: any) {
    res.status(403).json({ success: false, message: error.message });
  }
});

// Get ETL status and recent step logs
router.get('/status', (_req: Request, res: Response) => {
  const status = etlService.getPipelineStatus();
  res.json({ success: true, data: status });
});

// Get raw sources (for comparing before vs after ETL)
router.get('/raw-sources', (_req: Request, res: Response) => {
  const rawData = etlService.getRawSources();
  res.json({ success: true, data: rawData });
});

export default router;
