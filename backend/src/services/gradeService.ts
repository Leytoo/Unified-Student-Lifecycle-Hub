import { GradeUpdateSchema, GradeUpdateInput } from '../schemas/gradeSchema';
import { gradeRepository } from '../repositories/gradeRepository';
import { auditRepository } from '../repositories/auditRepository';
import { NotFoundError, DataQualityError } from '../exceptions';
import { UserRole, AuditAction } from '../constants';

export class GradeService {
  getAllGrades() {
    return gradeRepository.findAllEnrollments();
  }

  updateGrade(input: GradeUpdateInput, user: { id: string; role: UserRole; name?: string }) {
    // 1. Enforce DQM validation
    const validation = GradeUpdateSchema.safeParse(input);
    if (!validation.success) {
      throw new DataQualityError('Grade value or ID violated Data Quality Rules', validation.error.format());
    }

    const { enrollmentId, grade } = validation.data;

    // 2. Locate existing record
    const existing = gradeRepository.findEnrollmentById(enrollmentId);
    if (!existing) {
      throw new NotFoundError(`Enrollment reference with UUID '${enrollmentId}' was not found.`);
    }

    const previousGrade = existing.grade;

    // 3. Persist update
    const updated = gradeRepository.updateGrade(enrollmentId, grade, user.id);

    // 4. Data Governance Compliance: Write immutable Audit Log
    const auditRecord = auditRepository.log({
      userId: user.id,
      userRole: user.role,
      action: AuditAction.UPDATE_GRADE,
      targetId: enrollmentId,
      details: `Governed grade updated from [${previousGrade ?? 'N/A'}] to [${grade}] for enrollment UUID: ${enrollmentId}.`,
      metadata: { previousGrade, newGrade: grade, studentId: existing.studentId }
    });

    return {
      updatedRecord: updated,
      auditRecord
    };
  }
}

export const gradeService = new GradeService();
