import { db, Enrollment } from '../lib/db';

export class GradeRepository {
  findEnrollmentById(id: string): Enrollment | undefined {
    return db.enrollments.find(e => e.id === id);
  }

  findAllEnrollments(): (Enrollment & { studentName?: string; courseTitle?: string })[] {
    return db.enrollments.map(e => {
      const student = db.students.find(s => s.id === e.studentId);
      const course = db.courses.find(c => c.id === e.courseId);
      return {
        ...e,
        studentName: student ? `${student.firstName} ${student.lastName}` : 'Unknown',
        courseTitle: course ? course.title : 'Unknown'
      };
    });
  }

  updateGrade(id: string, grade: number, updatedBy: string): Enrollment {
    const enrollment = this.findEnrollmentById(id);
    if (!enrollment) throw new Error('Enrollment record not found');

    enrollment.grade = grade;
    enrollment.updatedAt = new Date().toISOString();
    enrollment.updatedBy = updatedBy;

    // Recalculate student GPA
    this.recalculateStudentGpa(enrollment.studentId);
    return enrollment;
  }

  private recalculateStudentGpa(studentId: string) {
    const studentEnrollments = db.enrollments.filter(e => e.studentId === studentId && e.grade !== null);
    if (studentEnrollments.length === 0) return;

    const sum = studentEnrollments.reduce((acc, curr) => acc + (curr.grade || 0), 0);
    const avg = parseFloat((sum / studentEnrollments.length).toFixed(2));

    const student = db.students.find(s => s.id === studentId);
    if (student) {
      student.gpa = avg;
    }
  }
}

export const gradeRepository = new GradeRepository();
