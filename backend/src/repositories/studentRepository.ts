import { db, Student } from '../lib/db';

export class StudentRepository {
  findAll(): Student[] {
    return [...db.students];
  }

  findById(id: string): Student | undefined {
    return db.students.find(s => s.id === id || s.studentNo === id);
  }

  save(student: Student): Student {
    const idx = db.students.findIndex(s => s.id === student.id);
    if (idx >= 0) {
      db.students[idx] = student;
    } else {
      db.students.push(student);
    }
    return student;
  }
}

export const studentRepository = new StudentRepository();
