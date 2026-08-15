import { Router } from 'express';
import cropJourneyController from '../controllers/cropJourneyController.js';
import { authenticate } from '../middleware/index.js';

const router = Router();

// Protected routes for creating/listing journeys
router.post('/', authenticate, cropJourneyController.createCropJourney);
router.get('/', authenticate, cropJourneyController.listCropJourneysForUser);
router.get('/:id', authenticate, cropJourneyController.getCropJourney);
router.patch('/:id/progress', authenticate, cropJourneyController.updateProgress);
router.post('/:id/irrigation', authenticate, cropJourneyController.addIrrigationLog);
router.post('/:id/health', authenticate, cropJourneyController.addHealthLog);
router.get('/:id/timeline', authenticate, cropJourneyController.getTimeline);

export default router;
