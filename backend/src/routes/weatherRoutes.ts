import { Router } from 'express';
import { query } from 'express-validator';
import * as weatherController from '../controllers/weatherController.js';
import { validate } from '../middleware/index.js';

const router = Router();

router.get('/current', [query('lat').notEmpty(), query('lon').notEmpty()], validate, weatherController.getCurrentWeather);
router.get('/alerts', [query('lat').notEmpty(), query('lon').notEmpty()], validate, weatherController.getWeatherAlerts);

export default router;
