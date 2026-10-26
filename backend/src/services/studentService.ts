import { studentRepository } from '../repositories/studentRepository';
import { maskStudentProfileForRole } from '../utils/piiMasker';
import { UserRole } from '../constants';
import { NotFoundError } from '../exceptions';
import { db } from '../lib/db';

export class StudentService {
  getStudents(role: UserRole) {
    const students = studentRepository.findAll();
    return students.map(s => {
      const masked = maskStudentProfileForRole(s, role);
      const studentEnrollments = db.enrollments.filter(e => e.studentId === s.id);
      return {
        ...masked,
        enrollmentCount: studentEnrollments.length,
        courses: studentEnrollments.map(e => {
          const c = db.courses.find(crs => crs.id === e.courseId);
          return { code: c?.code, title: c?.title, grade: e.grade };
        })
      };
    });
  }

  getStudentById(id: string, role: UserRole) {
    const student = studentRepository.findById(id);
    if (!student) throw new NotFoundError(`Student with identifier '${id}' not found.`);

    const masked = maskStudentProfileForRole(student, role);
    const enrollments = db.enrollments.filter(e => e.studentId === student.id).map(e => {
      const c = db.courses.find(crs => crs.id === e.courseId);
      return { ...e, courseCode: c?.code, courseTitle: c?.title };
    });

    return {
      ...masked,
      enrollments
    };
  }
}

export const studentService = new StudentService();
