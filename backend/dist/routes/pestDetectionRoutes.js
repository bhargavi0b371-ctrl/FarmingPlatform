import { Router } from 'express';
import { body } from 'express-validator';
import * as pestDetectionController from '../controllers/pestDetectionController.js';
import { authenticate, validate } from '../middleware/index.js';
const router = Router();
router.use(authenticate);
router.post('/detect', [body('imageUrl').notEmpty()], validate, pestDetectionController.detectPest);
router.get('/history', pestDetectionController.getDetectionHistory);
export default router;
