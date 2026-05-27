import { Router } from 'express';
import * as marketController from '../controllers/marketController.js';
const router = Router();
router.get('/', marketController.getMarketPrices);
router.get('/top-crops', marketController.getTopCrops);
export default router;
