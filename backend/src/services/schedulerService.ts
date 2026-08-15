import cron from 'node-cron';
import refreshService from './refreshService.js';
import { config } from '../config/index.js';

export class SchedulerService {
  start(): void {
    cron.schedule(`0 */${config.weather.updateIntervalHours} * * *`, async () => {
      console.log('[Scheduler] Running weather refresh task');
      await refreshService.refreshWeatherData();
    });

    cron.schedule(`0 */${config.market.updateIntervalHours} * * *`, async () => {
      console.log('[Scheduler] Running market refresh task');
      await refreshService.refreshMarketData();
    });

    cron.schedule('0 2 * * *', async () => {
      console.log('[Scheduler] Running daily government weather sync task');
      await refreshService.syncGovernmentWeatherData();
      console.log('[Scheduler] Running daily AI insights task');
      await refreshService.generateAiInsights();
      console.log('[Scheduler] Running daily smart alerts task');
      await refreshService.deliverSmartAlerts();
    });

    console.log('[Scheduler] Background jobs registered');
  }
}

export default new SchedulerService();
