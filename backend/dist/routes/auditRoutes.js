"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auditService_1 = require("../services/auditService");
const router = (0, express_1.Router)();
// Get all audit logs
router.get('/', (_req, res) => {
    const logs = auditService_1.auditService.getAll();
    const summary = auditService_1.auditService.getSummary();
    res.json({ success: true, summary, data: logs });
});
// Post a custom audit log event (e.g. client-side export or security action)
router.post('/log', (req, res) => {
    const { action, resource, details, actorRole, actorName, complianceStatus } = req.body;
    const ipAddress = req.ip || '127.0.0.1';
    const entry = auditService_1.auditService.log({
        actorRole: actorRole || 'STUDENT_VIEWER',
        actorName: actorName || 'Unknown Actor',
        action: action || 'READ',
        resource: resource || 'GENERAL_SYSTEM',
        details: details || 'No details provided',
        ipAddress,
        complianceStatus: complianceStatus || 'COMPLIANT'
    });
    res.json({ success: true, data: entry });
});
exports.default = router;
