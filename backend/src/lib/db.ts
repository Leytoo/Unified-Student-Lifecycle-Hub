import { UserRole } from '../constants';

export interface Student {
  id: string;
  studentNo: string;
  firstName: string;
  lastName: string;
  email: string;
  department: string;
  yearLevel: number;
  gpa: number;
  ssn: string;
  phone: string;
  isVerified: boolean;
  dqmStatus: 'CLEAN' | 'ANOMALY_DETECTED' | 'REMEDIATED';
  dqmFlags: string[];
}

export interface Course {
  id: string;
  code: string;
  title: string;
  credits: number;
  department: string;
}

export interface Enrollment {
  id: string; // UUID
  studentId: string;
  courseId: string;
  semester: string;
  grade: number | null;
  updatedAt: string;
  updatedBy: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userRole: UserRole;
  action: string;
  targetId: string;
  details: string;
  metadata?: Record<string, any>;
}

export interface DqmMetric {
  dimension: string;
  description: string;
  score: number; // percentage 0 - 100
  totalChecked: number;
  anomaliesFound: number;
  status: 'OPTIMAL' | 'WARNING' | 'CRITICAL';
}

class InMemoryDatabase {
  public students: Student[] = [
    {
      id: 'c83d6a2f-1a91-4c91-b66a-111111111111',
      studentNo: 'STU-2026-0001',
      firstName: 'Sophia',
      lastName: 'Alvarez',
      email: 'sophia.alvarez@university.edu',
      department: 'Computer Science',
      yearLevel: 3,
      gpa: 3.85,
      ssn: '123-45-6789',
      phone: '555-019-2831',
      isVerified: true,
      dqmStatus: 'CLEAN',
      dqmFlags: []
    },
    {
      id: 'd94e7b3a-2b92-4d92-c77b-222222222222',
      studentNo: 'STU-2026-0002',
      firstName: 'Liam',
      lastName: 'Chen',
      email: 'liam.chen@university.edu',
      department: 'Data Analytics',
      yearLevel: 2,
      gpa: 3.40,
      ssn: '234-56-7890',
      phone: '555-018-4729',
      isVerified: true,
      dqmStatus: 'CLEAN',
      dqmFlags: []
    },
    {
      id: 'e05f8c4b-3c93-4e93-d88c-333333333333',
      studentNo: 'STU-2026-0003',
      firstName: 'Mateo',
      lastName: 'Cruz',
      email: 'mateo.cruz@invalid-mail', // DQM Validity issue
      department: 'Software Engineering',
      yearLevel: 4,
      gpa: 3.10,
      ssn: '345-67-8901',
      phone: '555-017-9182',
      isVerified: false,
      dqmStatus: 'ANOMALY_DETECTED',
      dqmFlags: ['INVALID_EMAIL_DOMAIN', 'UNVERIFIED_IDENTITY']
    },
    {
      id: 'f16a9d5c-4d94-4f94-e99d-444444444444',
      studentNo: 'STU-2026-0004',
      firstName: 'EMMA', // DQM consistency issue (all caps)
      lastName: 'WATSON',
      email: 'emma.watson@university.edu',
      department: 'Cybersecurity',
      yearLevel: 1,
      gpa: 3.95,
      ssn: '456-78-9012',
      phone: '555-016-3721',
      isVerified: true,
      dqmStatus: 'ANOMALY_DETECTED',
      dqmFlags: ['INCONSISTENT_CASING']
    }
  ];

  public courses: Course[] = [
    { id: 'crs-cs101', code: 'CS-101', title: 'Data Governance & Ethics', credits: 3, department: 'Computer Science' },
    { id: 'crs-cs202', code: 'CS-202', title: 'Database Systems & DQM', credits: 4, department: 'Computer Science' },
    { id: 'crs-da301', code: 'DA-301', title: 'Enterprise Data Pipelines (ETL)', credits: 3, department: 'Data Analytics' }
  ];

  public enrollments: Enrollment[] = [
    {
      id: '7b952f1e-8488-444c-9f79-450ce9e232b1',
      studentId: 'c83d6a2f-1a91-4c91-b66a-111111111111',
      courseId: 'crs-cs101',
      semester: 'Fall 2026',
      grade: 3.8,
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
      updatedBy: 'FACULTY_DR_SMITH'
    },
    {
      id: '8ca63a2f-9599-555d-af8a-561df0f343c2',
      studentId: 'c83d6a2f-1a91-4c91-b66a-111111111111',
      courseId: 'crs-cs202',
      semester: 'Fall 2026',
      grade: 3.9,
      updatedAt: new Date(Date.now() - 43200000).toISOString(),
      updatedBy: 'FACULTY_PROF_DAVIS'
    },
    {
      id: '9db74b3a-0600-666e-bf9b-672ef1f454d3',
      studentId: 'd94e7b3a-2b92-4d92-c77b-222222222222',
      courseId: 'crs-cs101',
      semester: 'Fall 2026',
      grade: 3.4,
      updatedAt: new Date(Date.now() - 172800000).toISOString(),
      updatedBy: 'FACULTY_DR_SMITH'
    },
    {
      id: 'a0c85c4b-1711-777f-cfac-783f02f565e4',
      studentId: 'e05f8c4b-3c93-4e93-d88c-333333333333',
      courseId: 'crs-da301',
      semester: 'Fall 2026',
      grade: 3.1,
      updatedAt: new Date(Date.now() - 259200000).toISOString(),
      updatedBy: 'FACULTY_DR_SMITH'
    }
  ];

  public auditLogs: AuditLog[] = [
    {
      id: 'audit-001',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
      userId: 'FACULTY_DR_SMITH',
      userRole: UserRole.FACULTY,
      action: 'UPDATE_STUDENT_GRADE',
      targetId: '7b952f1e-8488-444c-9f79-450ce9e232b1',
      details: 'Recorded grade 3.8 for CS-101. Passed DQM bounds verification (0.0 - 4.0).'
    },
    {
      id: 'audit-002',
      timestamp: new Date(Date.now() - 43200000).toISOString(),
      userId: 'REGISTRAR_ADMIN',
      userRole: UserRole.REGISTRAR,
      action: 'VERIFY_STUDENT_IDENTITY',
      targetId: 'c83d6a2f-1a91-4c91-b66a-111111111111',
      details: 'Verified government-issued ID and FERPA consent agreement.'
    }
  ];
}

export const db = new InMemoryDatabase();
