import { Router } from 'express';
import { updateStudentGrade, getGrades } from '../controllers/gradeController';
import { requireRole } from '../middlewares/authMiddleware';
import { UserRole } from '../constants';

const router = Router();

// Read grades: Students, Faculty, Registrars
router.get('/', getGrades);

// Update grades: Strictly governed - Only Faculty and Registrars
router.post('/', requireRole([UserRole.FACULTY, UserRole.REGISTRAR, UserRole.ADMIN]), updateStudentGrade);

export default router;
