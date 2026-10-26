"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dqmService_1 = require("../services/dqmService");
const etlService_1 = require("../services/etlService");
const router = (0, express_1.Router)();
// Get DQM metrics & score breakdown
router.get('/metrics', (_req, res) => {
    const metrics = dqmService_1.dqmService.calculateMetrics();
    res.json({ success: true, data: metrics });
});
// Get all detected DQM defects
router.get('/issues', (_req, res) => {
    // If issues haven't been generated yet, run extraction scan
    if (dqmService_1.dqmService.getIssues().length === 0) {
        const raw = etlService_1.etlService.getRawSources();
        dqmService_1.dqmService.validateRawRecords(raw.sis, raw.lms, raw.lib);
    }
    const issues = dqmService_1.dqmService.getIssues();
    res.json({ success: true, data: issues });
});
// Resolve a specific DQM defect (Remediation workbench)
router.post('/resolve/:issueId', (req, res) => {
    const { issueId } = req.params;
    const actorRole = req.headers['x-user-role'] || 'DATA_STEWARD';
    const actorName = req.headers['x-user-name'] || 'Marcus Vance';
    const issue = dqmService_1.dqmService.resolveIssue(issueId, actorRole, actorName);
    if (!issue) {
        return res.status(404).json({ success: false, message: 'Issue not found' });
    }
    res.json({ success: true, data: issue, message: 'Data quality defect remediated and audited.' });
});
exports.default = router;
