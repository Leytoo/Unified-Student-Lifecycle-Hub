import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { governanceService } from '../services/governanceService';

export const getPolicies = (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const policies = governanceService.getPolicies();
    return res.status(200).json({ success: true, data: policies });
  } catch (error) {
    next(error);
  }
};

export const getAuditLogs = (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const logs = governanceService.getAuditLogs();
    return res.status(200).json({ success: true, count: logs.length, data: logs });
  } catch (error) {
    next(error);
  }
};
