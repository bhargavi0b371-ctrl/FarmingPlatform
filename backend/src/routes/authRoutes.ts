import { Router } from 'express';
import { body } from 'express-validator';
import * as authController from '../controllers/authController.js';
import { authenticate, validate } from '../middleware/index.js';

const router = Router();

router.post('/login', [body('contact').notEmpty()], validate, authController.login);
router.post('/send-otp', [body('contact').notEmpty()], validate, authController.sendOTP);
router.post('/verify-otp', [body('contact').notEmpty(), body('otp').notEmpty()], validate, authController.verifyOTP);
router.post('/register', [body('contact').notEmpty(), body('name').notEmpty()], validate, authController.register);
router.get('/profile', authenticate, authController.getProfile);
router.put('/profile', authenticate, authController.updateProfile);

export default router;
