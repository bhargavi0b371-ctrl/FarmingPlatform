import { Router } from 'express';
import { body } from 'express-validator';
import * as farmController from '../controllers/farmController.js';
import { authenticate, validate } from '../middleware/index.js';

const router = Router();
router.use(authenticate);

router.post('/', [body('name').notEmpty()], validate, farmController.createFarm);
router.get('/', farmController.getFarms);
router.get('/:farmId', farmController.getFarmById);
router.post('/:farmId/crops', [body('name').notEmpty()], validate, farmController.addCrop);
router.get('/:farmId/crops', farmController.getCrops);
router.delete('/:farmId', farmController.deleteFarm);

export default router;
