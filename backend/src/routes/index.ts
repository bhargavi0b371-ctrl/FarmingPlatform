import { Router } from 'express';
import authRoutes from './authRoutes.js';
import farmRoutes from './farmRoutes.js';
import weatherRoutes from './weatherRoutes.js';
import advisoryRoutes from './advisoryRoutes.js';
import pestDetectionRoutes from './pestDetectionRoutes.js';
import marketRoutes from './marketRoutes.js';
import chatbotRoutes from './chatbotRoutes.js';
import notificationRoutes from './notificationRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/farms', farmRoutes);
router.use('/weather', weatherRoutes);
router.use('/advisories', advisoryRoutes);
router.use('/pest-detection', pestDetectionRoutes);
router.use('/market', marketRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/notifications', notificationRoutes);

router.get('/health', (req, res) => {
  res.json({ success: true, data: { status: 'healthy', timestamp: new Date().toISOString() } });
});

export default router;
