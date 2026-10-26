import { app } from './app';
import { config } from './config';
import { dqmWorker } from './workers/dqmScanner';

const server = app.listen(config.port, () => {
  console.log(`=======================================================`);
  console.log(`🏛️ Student Lifecycle & Data Governance Server Running`);
  console.log(`📡 URL: http://localhost:${config.port}`);
  console.log(`🛡️ Data Quality Management (DQM) & FERPA RBAC Active`);
  console.log(`=======================================================`);

  // Start background quality scan worker
  dqmWorker.start(300000); // scans every 5 mins
});

process.on('SIGTERM', () => {
  console.log('Shutting down server gracefully...');
  dqmWorker.stop();
  server.close(() => process.exit(0));
});

export default server;
