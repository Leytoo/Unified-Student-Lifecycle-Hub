import { dataQualityService } from '../services/dataQualityService';

export class DqmAuditWorker {
  private timer: NodeJS.Timeout | null = null;

  start(intervalMs = 60000) {
    console.log('[DQM Worker] Started background data quality scan worker...');
    this.timer = setInterval(() => {
      const metrics = dataQualityService.getMetrics();
      console.log(`[DQM Worker] Automated scan complete. Health Index: ${metrics.overallHealthScore}%`);
    }, intervalMs);
  }

  stop() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
  }
}

export const dqmWorker = new DqmAuditWorker();
