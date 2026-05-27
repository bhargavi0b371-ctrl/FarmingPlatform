import { Request, Response } from 'express';
import { chatbotService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';
import { Language } from '../types/index.js';

export const sendMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const { message, language, sessionId } = req.body;
    if (!message) { res.status(400).json({ success: false, error: 'Message required' }); return; }
    const response = await chatbotService.processMessage(userId, message, language as Language || 'en', sessionId);
    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getChatHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const history = await chatbotService.getChatHistory(userId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
