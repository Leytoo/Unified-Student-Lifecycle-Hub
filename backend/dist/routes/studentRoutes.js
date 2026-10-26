"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentService_1 = require("../services/studentService");
const router = (0, express_1.Router)();
// Get all unified students (respecting role-based PII masking)
router.get('/', (req, res) => {
    const role = req.headers['x-user-role'] || 'DATA_STEWARD';
    const actorName = req.headers['x-user-name'] || 'Authorized User';
    const clientIp = req.ip || '127.0.0.1';
    const students = studentService_1.studentService.getAll(role, actorName, clientIp);
    res.json({ success: true, count: students.length, data: students });
});
// Get individual student profile
router.get('/:id', (req, res) => {
    const { id } = req.params;
    const role = req.headers['x-user-role'] || 'DATA_STEWARD';
    const actorName = req.headers['x-user-name'] || 'Authorized User';
    const clientIp = req.ip || '127.0.0.1';
    const student = studentService_1.studentService.getById(id, role, actorName, clientIp);
    if (!student) {
        return res.status(404).json({ success: false, message: 'Student record not found.' });
    }
    res.json({ success: true, data: student });
});
// Update student record (requires Data Steward or DPO)
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const role = req.headers['x-user-role'] || 'DATA_STEWARD';
        const actorName = req.headers['x-user-name'] || 'Marcus Vance';
        const clientIp = req.ip || '127.0.0.1';
        const updated = studentService_1.studentService.updateStudent(id, req.body, role, actorName, clientIp);
        res.json({ success: true, data: updated, message: 'Student record updated with full audit trail.' });
    }
    catch (err) {
        res.status(403).json({ success: false, message: err.message });
    }
});
exports.default = router;
