"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.governanceService = void 0;
const auditService_1 = require("./auditService");
class GovernanceService {
    policies = [
        {
            id: 'POL-001',
            code: 'FERPA-SEC-34',
            title: 'FERPA Student Record Privacy & PII Masking',
            regulation: 'FERPA',
            dataOwner: 'Office of the University Registrar',
            classificationLevel: 'HIGHLY_SENSITIVE',
            retentionYears: 5,
            description: 'Educational records and personally identifiable information (SSN, contact numbers, disciplinary status) must not be disclosed without explicit consent or authorized academic necessity.',
            enforcementRule: 'Mask SSN and phone numbers for non-administrative roles (Faculty, Students). Prohibit bulk external exports.',
            active: true
        },
        {
            id: 'POL-002',
            code: 'DQM-ACC-12',
            title: 'Golden Record Authority & Deduplication',
            regulation: 'INTERNAL_SECURITY',
            dataOwner: 'Enterprise Data Governance Board',
            classificationLevel: 'CONFIDENTIAL',
            retentionYears: 10,
            description: 'The Unified Student 360 database constitutes the single source of truth. Deduplication algorithms must reconcile conflicting records across SIS, LMS, and Library.',
            enforcementRule: 'Block ingestion of duplicate student IDs and require steward review for name/DOB collision.',
            active: true
        },
        {
            id: 'POL-003',
            code: 'GDPR-ART-17',
            title: 'Right to Rectification & Data Accuracy',
            regulation: 'GDPR',
            dataOwner: 'Data Protection Officer (DPO)',
            classificationLevel: 'CONFIDENTIAL',
            retentionYears: 7,
            description: 'Students and academic data stewards possess the verified right to rectify inaccurate, outdated, or incomplete academic and biographical data.',
            enforcementRule: 'All data quality remediation actions must be tracked with timestamped before/after audit values.',
            active: true
        },
        {
            id: 'POL-004',
            code: 'RBAC-ACC-05',
            title: 'Role-Based Least Privilege Access Principle',
            regulation: 'INTERNAL_SECURITY',
            dataOwner: 'IT Security Directorate',
            classificationLevel: 'CONFIDENTIAL',
            retentionYears: 3,
            description: 'Access rights are segregated into DPO Admin, Data Steward, Faculty Advisor, and Student Viewer to minimize insider threats and accidental leaks.',
            enforcementRule: 'Reject unauthenticated write attempts and restrict administrative endpoints to Steward/DPO roles.',
            active: true
        }
    ];
    getPolicies() {
        return this.policies;
    }
    updatePolicyStatus(id, active, actorRole, actorName) {
        const policy = this.policies.find(p => p.id === id);
        if (!policy)
            return null;
        // Check permission
        if (actorRole !== 'DPO_ADMIN') {
            auditService_1.auditService.log({
                actorRole,
                actorName,
                action: 'SECURITY_VIOLATION',
                resource: policy.code,
                details: `Unauthorized attempt by ${actorRole} to alter governance policy status.`,
                ipAddress: '192.168.1.100',
                complianceStatus: 'BREACH_ATTEMPT'
            });
            throw new Error('Access Denied: Only DPO Administrator can alter Enterprise Governance Policies.');
        }
        policy.active = active;
        auditService_1.auditService.log({
            actorRole,
            actorName,
            action: 'POLICY_UPDATE',
            resource: policy.code,
            details: `Policy ${policy.code} active state toggled to ${active}.`,
            ipAddress: '192.168.1.10',
            complianceStatus: 'COMPLIANT'
        });
        return policy;
    }
    applyPiiMasking(student, role) {
        // If Admin or Data Steward, full visibility for operations
        if (role === 'DPO_ADMIN' || role === 'DATA_STEWARD') {
            return { ...student };
        }
        // Faculty Advisor & Student Viewer have PII masked
        const maskedSsn = student.nationalIdSsn ? '***-**-' + student.nationalIdSsn.slice(-4) : '***-**-****';
        const maskedPhone = student.phone && student.phone !== 'N/A'
            ? student.phone.slice(0, 4) + '***-***' + student.phone.slice(-2)
            : '***-***-****';
        return {
            ...student,
            nationalIdSsn: maskedSsn,
            phone: maskedPhone,
            // For student viewer, mask other internal disciplinary or financial metrics if needed
            outstandingFines: role === 'STUDENT_VIEWER' ? student.outstandingFines : student.outstandingFines
        };
    }
}
exports.governanceService = new GovernanceService();
