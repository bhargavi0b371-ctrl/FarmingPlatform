import { Router } from 'express';
import { config } from '../config/index.js';
import authRoutes from './authRoutes.js';
import farmRoutes from './farmRoutes.js';
import weatherRoutes from './weatherRoutes.js';
import advisoryRoutes from './advisoryRoutes.js';
import pestDetectionRoutes from './pestDetectionRoutes.js';
import marketRoutes from './marketRoutes.js';
import chatbotRoutes from './chatbotRoutes.js';
import notificationRoutes from './notificationRoutes.js';
import cropJourneyRoutes from './cropJourneyRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/pest-detection', pestDetectionRoutes);
router.use('/market', marketRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/notifications', notificationRoutes);
router.use('/crop-journeys', cropJourneyRoutes);

router.get('/health', (req, res) => {
  const missing: string[] = [];
  if (!config.openweather.apiKey) missing.push('OPENWEATHER_API_KEY');
  if (!config.market.sourceUrl) missing.push('MARKET_SOURCE_URL');
  if (!config.firebase.serviceAccountJson) missing.push('FIREBASE_SERVICE_ACCOUNT_JSON');

  if (missing.length > 0) {
    res.status(503).json({ success: false, error: `Missing configuration: ${missing.join(', ')}` });
    return;
  }

  res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

export default router;
