"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const etlService_1 = require("../services/etlService");
const router = (0, express_1.Router)();
// Run ETL pipeline
router.post('/run', (req, res) => {
    try {
        const role = req.headers['x-user-role'] || 'DATA_STEWARD';
        const actorName = req.headers['x-user-name'] || 'Marcus Vance (Data Steward)';
        const clientIp = req.ip || '127.0.0.1';
        const result = etlService_1.etlService.runPipeline(role, actorName, clientIp);
        res.json({ success: true, ...result });
    }
    catch (error) {
        res.status(403).json({ success: false, message: error.message });
    }
});
// Get ETL status and recent step logs
router.get('/status', (_req, res) => {
    const status = etlService_1.etlService.getPipelineStatus();
    res.json({ success: true, data: status });
});
// Get raw sources (for comparing before vs after ETL)
router.get('/raw-sources', (_req, res) => {
    const rawData = etlService_1.etlService.getRawSources();
    res.json({ success: true, data: rawData });
});
exports.default = router;
