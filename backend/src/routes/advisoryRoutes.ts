import { Router } from 'express';
import * as advisoryController from '../controllers/advisoryController.js';
import { authenticate } from '../middleware/index.js';

const router = Router();
router.use(authenticate);

router.get('/', advisoryController.getAdvisories);
router.post('/crop-recommendations', advisoryController.generateCropRecommendations);
router.post('/ai', advisoryController.generateAIAdvisory);

export default router;
