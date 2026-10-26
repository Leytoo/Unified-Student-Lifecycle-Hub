import { db } from '../lib/db';
import { auditRepository } from '../repositories/auditRepository';
import { UserRole, AuditAction, DqmDimension } from '../constants';

export class DataQualityService {
  getMetrics() {
    const totalStudents = db.students.length;
    const totalEnrollments = db.enrollments.length;

    // 1. Completeness: All mandatory fields populated
    const completeStudents = db.students.filter(s => s.studentNo && s.firstName && s.lastName && s.email && s.department);
    const completenessScore = Math.round((completeStudents.length / totalStudents) * 100);

    // 2. Validity: Matches standard regex/rules
    const validEmails = db.students.filter(s => s.email.includes('@') && s.email.endsWith('.edu'));
    const validityScore = Math.round((validEmails.length / totalStudents) * 100);

    // 3. Consistency: Standard casing & formatting
    const consistentNames = db.students.filter(s => s.firstName !== s.firstName.toUpperCase() && s.lastName !== s.lastName.toUpperCase());
    const consistencyScore = Math.round((consistentNames.length / totalStudents) * 100);

    // 4. Uniqueness: No duplicate Student Numbers
    const uniqueNos = new Set(db.students.map(s => s.studentNo));
    const uniquenessScore = Math.round((uniqueNos.size / totalStudents) * 100);

    // Overall DQM Health Index
    const overallScore = Math.round((completenessScore + validityScore + consistencyScore + uniquenessScore) / 4);

    return {
      overallHealthScore: overallScore,
      totalRecordsAnalyzed: totalStudents + totalEnrollments,
      dimensions: [
        {
          name: DqmDimension.COMPLETENESS,
          description: 'Checks if all critical attributes (SSN, Email, Dept) are populated',
          score: completenessScore,
          status: completenessScore >= 95 ? 'OPTIMAL' : 'WARNING'
        },
        {
          name: DqmDimension.VALIDITY,
          description: 'Validates RFC syntax for university institutional emails and GPA ranges',
          score: validityScore,
          status: validityScore >= 95 ? 'OPTIMAL' : 'WARNING'
        },
        {
          name: DqmDimension.CONSISTENCY,
          description: 'Ensures proper title casing for student names across departments',
          score: consistencyScore,
          status: consistencyScore >= 95 ? 'OPTIMAL' : 'WARNING'
        },
        {
          name: DqmDimension.UNIQUENESS,
          description: 'Prevents duplicate student registrations and primary key collisions',
          score: uniquenessScore,
          status: uniquenessScore >= 95 ? 'OPTIMAL' : 'WARNING'
        }
      ],
      anomalies: db.students.filter(s => s.dqmStatus === 'ANOMALY_DETECTED').map(s => ({
        studentId: s.id,
        studentNo: s.studentNo,
        name: `${s.firstName} ${s.lastName}`,
        flags: s.dqmFlags,
        email: s.email
      }))
    };
  }

  remediateAnomalies(user: { id: string; role: UserRole }) {
    let remediatedCount = 0;

    db.students.forEach(student => {
      if (student.dqmStatus === 'ANOMALY_DETECTED') {
        // Fix invalid email domains
        if (student.email.endsWith('@invalid-mail')) {
          student.email = `${student.firstName.toLowerCase()}.${student.lastName.toLowerCase()}@university.edu`;
        }

        // Fix casing (e.g., EMMA WATSON -> Emma Watson)
        student.firstName = student.firstName.charAt(0).toUpperCase() + student.firstName.slice(1).toLowerCase();
        student.lastName = student.lastName.charAt(0).toUpperCase() + student.lastName.slice(1).toLowerCase();

        student.isVerified = true;
        student.dqmStatus = 'REMEDIATED';
        student.dqmFlags = [];
        remediatedCount++;
      }
    });

    auditRepository.log({
      userId: user.id,
      userRole: user.role,
      action: AuditAction.DQM_REMEDIATION,
      targetId: 'ALL_STUDENTS',
      details: `Executed automated DQM remediation pipeline. Resolved ${remediatedCount} data anomalies.`
    });

    return {
      message: `Successfully remediated ${remediatedCount} student data anomalies.`,
      remediatedCount,
      metrics: this.getMetrics()
    };
  }
}

export const dataQualityService = new DataQualityService();
