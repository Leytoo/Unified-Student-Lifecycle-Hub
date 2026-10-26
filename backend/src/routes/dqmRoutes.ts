import { Router, Request, Response } from 'express';
import { dqmService } from '../services/dqmService';
import { etlService } from '../services/etlService';

const router = Router();

// Get DQM metrics & score breakdown
router.get('/metrics', (_req: Request, res: Response) => {
  const metrics = dqmService.calculateMetrics();
  res.json({ success: true, data: metrics });
});

// Get all detected DQM defects
router.get('/issues', (_req: Request, res: Response) => {
  // If issues haven't been generated yet, run extraction scan
  if (dqmService.getIssues().length === 0) {
    const raw = etlService.getRawSources();
    dqmService.validateRawRecords(raw.sis, raw.lms, raw.lib);
  }
  const issues = dqmService.getIssues();
  res.json({ success: true, data: issues });
});

// Resolve a specific DQM defect (Remediation workbench)
router.post('/resolve/:issueId', (req: Request, res: Response) => {
  const { issueId } = req.params;
  const actorRole = (req.headers['x-user-role'] as string) || 'DATA_STEWARD';
  const actorName = (req.headers['x-user-name'] as string) || 'Marcus Vance';

  const issue = dqmService.resolveIssue(issueId, actorRole, actorName);
  if (!issue) {
    return res.status(404).json({ success: false, message: 'Issue not found' });
  }

  res.json({ success: true, data: issue, message: 'Data quality defect remediated and audited.' });
});

export default router;
