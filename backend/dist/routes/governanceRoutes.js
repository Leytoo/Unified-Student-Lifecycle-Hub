"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const governanceService_1 = require("../services/governanceService");
const router = (0, express_1.Router)();
// Get all active governance policies
router.get('/policies', (_req, res) => {
    const policies = governanceService_1.governanceService.getPolicies();
    res.json({ success: true, data: policies });
});
// Update policy status
router.patch('/policies/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { active } = req.body;
        const actorRole = req.headers['x-user-role'] || 'DATA_STEWARD';
        const actorName = req.headers['x-user-name'] || 'Marcus Vance';
        const updated = governanceService_1.governanceService.updatePolicyStatus(id, Boolean(active), actorRole, actorName);
        if (!updated) {
            return res.status(404).json({ success: false, message: 'Policy not found' });
        }
        res.json({ success: true, data: updated });
    }
    catch (err) {
        res.status(403).json({ success: false, message: err.message });
    }
});
exports.default = router;
