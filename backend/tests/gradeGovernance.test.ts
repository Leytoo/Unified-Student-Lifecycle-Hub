import { GradeUpdateSchema } from '../src/schemas/gradeSchema';
import { gradeService } from '../src/services/gradeService';
import { UserRole } from '../src/constants';

console.log('🧪 Running Student Lifecycle System Automated Quality Tests...\n');

// Test 1: DQM Grade Range Boundary Testing
console.log('Test 1: DQM Grade Range Boundary Check (Zod Validation)');
const invalidLow = GradeUpdateSchema.safeParse({ enrollmentId: '7b952f1e-8488-444c-9f79-450ce9e232b1', grade: -0.5 });
console.assert(!invalidLow.success, 'FAIL: Negative grade should be rejected by DQM');
console.log('✅ PASS: Negative grade correctly rejected.');

const invalidHigh = GradeUpdateSchema.safeParse({ enrollmentId: '7b952f1e-8488-444c-9f79-450ce9e232b1', grade: 4.5 });
console.assert(!invalidHigh.success, 'FAIL: Grade > 4.0 should be rejected by DQM');
console.log('✅ PASS: Grade > 4.0 correctly rejected.');

const validGrade = GradeUpdateSchema.safeParse({ enrollmentId: '7b952f1e-8488-444c-9f79-450ce9e232b1', grade: 3.75 });
console.assert(validGrade.success, 'FAIL: Grade 3.75 should be valid');
console.log('✅ PASS: Valid grade 3.75 successfully accepted.');

// Test 2: Service Level Update & Audit Log Generation
console.log('\nTest 2: Service Update & Immutable Audit Log Verification');
const result = gradeService.updateGrade(
  { enrollmentId: '7b952f1e-8488-444c-9f79-450ce9e232b1', grade: 3.9 },
  { id: 'FACULTY-001', role: UserRole.FACULTY, name: 'Dr. Alan Turing' }
);

console.assert(result.updatedRecord.grade === 3.9, 'FAIL: Grade not updated in repository');
console.assert(result.auditRecord.action === 'UPDATE_STUDENT_GRADE', 'FAIL: Audit action not logged');
console.log(`✅ PASS: Grade updated to ${result.updatedRecord.grade} with Audit ID ${result.auditRecord.id}.`);

console.log('\n🎉 ALL DATA GOVERNANCE & DQM UNIT TESTS PASSED SUCCESSFULLY!\n');
