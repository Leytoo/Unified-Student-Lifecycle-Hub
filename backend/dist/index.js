"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const etlRoutes_1 = __importDefault(require("./routes/etlRoutes"));
const dqmRoutes_1 = __importDefault(require("./routes/dqmRoutes"));
const governanceRoutes_1 = __importDefault(require("./routes/governanceRoutes"));
const studentRoutes_1 = __importDefault(require("./routes/studentRoutes"));
const auditRoutes_1 = __importDefault(require("./routes/auditRoutes"));
const etlService_1 = require("./services/etlService");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
// Enable CORS and JSON parsing
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// API health check
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ONLINE',
        system: 'EduGov University Enterprise Data Management (EDM) Hub',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    });
});
// Mount Routes
app.use('/api/etl', etlRoutes_1.default);
app.use('/api/dqm', dqmRoutes_1.default);
app.use('/api/governance', governanceRoutes_1.default);
app.use('/api/students', studentRoutes_1.default);
app.use('/api/audit', auditRoutes_1.default);
// Serve static frontend in production if client/dist exists
const clientDistPath = path_1.default.join(__dirname, '../../client/dist');
if (fs_1.default.existsSync(clientDistPath)) {
    console.log(`[Static] Serving React frontend from ${clientDistPath}`);
    app.use(express_1.default.static(clientDistPath));
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(clientDistPath, 'index.html'));
    });
}
// Auto-run initial ETL pipeline so data is loaded and ready on boot
try {
    console.log('[System Init] Bootstrapping initial ETL pipeline...');
    etlService_1.etlService.runPipeline('DPO_ADMIN', 'System Initializer', '127.0.0.1');
    console.log('[System Init] Initial ETL pipeline executed successfully.');
}
catch (err) {
    console.error('[System Init] Error running initial ETL:', err);
}
app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🚀 EduGov EDM Server running on http://localhost:${PORT}`);
    console.log(`📚 Reinforcing Data Governance & Data Quality Management`);
    console.log(`=======================================================`);
});
