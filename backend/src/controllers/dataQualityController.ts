import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { dataQualityService } from '../services/dataQualityService';

export const getDqmMetrics = (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const metrics = dataQualityService.getMetrics();
    return res.status(200).json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
};

export const remediateAnomalies = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const result = dataQualityService.remediateAnomalies(user);
    return res.status(200).json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
};
