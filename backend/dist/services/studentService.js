"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.studentService = void 0;
const governanceService_1 = require("./governanceService");
const auditService_1 = require("./auditService");
class StudentService {
    students = [];
    setUnifiedStudents(records) {
        this.students = records;
    }
    getAll(role, actorName, clientIp) {
        // Log the read action
        auditService_1.auditService.log({
            actorRole: role,
            actorName,
            action: 'READ',
            resource: 'STUDENT_360_COLLECTION',
            details: `Retrieved ${this.students.length} unified student profiles with role=${role}. PII masking applied.`,
            ipAddress: clientIp,
            complianceStatus: 'COMPLIANT'
        });
        return this.students.map(s => governanceService_1.governanceService.applyPiiMasking(s, role));
    }
    getById(id, role, actorName, clientIp) {
        const student = this.students.find(s => s.id === id || s.studentId === id);
        if (!student)
            return null;
        auditService_1.auditService.log({
            actorRole: role,
            actorName,
            action: 'READ',
            resource: `STUDENT_360:${student.studentId}`,
            details: `Detailed profile view for ${student.fullName} (${student.studentId}).`,
            ipAddress: clientIp,
            complianceStatus: 'COMPLIANT'
        });
        return governanceService_1.governanceService.applyPiiMasking(student, role);
    }
    updateStudent(studentId, updates, role, actorName, clientIp) {
        // Check role permission
        if (role === 'STUDENT_VIEWER' || role === 'FACULTY_ADVISOR') {
            auditService_1.auditService.log({
                actorRole: role,
                actorName,
                action: 'SECURITY_VIOLATION',
                resource: `STUDENT_360:${studentId}`,
                details: `Unauthorized attempt by ${role} to modify student profile data. Blocked by Data Governance.`,
                ipAddress: clientIp,
                complianceStatus: 'BREACH_ATTEMPT'
            });
            throw new Error(`Access Denied: Role '${role}' lacks write authorization for Master Student 360 records.`);
        }
        const index = this.students.findIndex(s => s.studentId === studentId);
        if (index === -1) {
            throw new Error(`Student ${studentId} not found.`);
        }
        const previous = { ...this.students[index] };
        this.students[index] = { ...previous, ...updates, lastIntegratedAt: new Date().toISOString() };
        auditService_1.auditService.log({
            actorRole: role,
            actorName,
            action: 'WRITE',
            resource: `STUDENT_360:${studentId}`,
            details: `Updated fields: ${Object.keys(updates).join(', ')} by ${actorName}. Data Governance compliant audit record created.`,
            ipAddress: clientIp,
            complianceStatus: 'COMPLIANT'
        });
        return this.students[index];
    }
    getRawStudents() {
        return this.students;
    }
}
exports.studentService = new StudentService();
