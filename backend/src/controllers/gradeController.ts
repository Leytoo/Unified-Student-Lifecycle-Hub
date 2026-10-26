import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { gradeService } from '../services/gradeService';

export const updateStudentGrade = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!;
    const result = await gradeService.updateGrade(req.body, user);

    return res.status(200).json({
      success: true,
      message: 'Grade successfully updated under governance protocols.',
      data: result.updatedRecord,
      audit: result.auditRecord
    });
  } catch (error) {
    next(error);
  }
};

export const getGrades = async (_req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const grades = gradeService.getAllGrades();
    return res.status(200).json({
      success: true,
      data: grades
    });
  } catch (error) {
    next(error);
  }
};
