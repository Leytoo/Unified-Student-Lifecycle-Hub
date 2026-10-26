import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middlewares/authMiddleware';
import { studentService } from '../services/studentService';
import { UserRole } from '../constants';

export const getStudents = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const role = req.user?.role || UserRole.STUDENT;
    const students = studentService.getStudents(role);
    return res.status(200).json({
      success: true,
      activeRole: role,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

export const getStudentById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const role = req.user?.role || UserRole.STUDENT;
    const student = studentService.getStudentById(req.params.id, role);
    return res.status(200).json({
      success: true,
      data: student
    });
  } catch (error) {
    next(error);
  }
};
