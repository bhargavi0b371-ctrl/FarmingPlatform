import { Router } from 'express';
import { body } from 'express-validator';
import * as chatbotController from '../controllers/chatbotController.js';
import { authenticate, validate } from '../middleware/index.js';

const router = Router();
router.use(authenticate);

router.post('/', [body('message').notEmpty()], validate, chatbotController.sendMessage);
router.get('/history', chatbotController.getChatHistory);

export default router;
