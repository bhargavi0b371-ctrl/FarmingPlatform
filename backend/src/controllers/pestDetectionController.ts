import { Request, Response } from 'express';
import { pestDetectionService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';

export const detectPest = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const { imageUrl } = req.body;
    if (!imageUrl) { res.status(400).json({ success: false, error: 'Image URL required' }); return; }
    const result = await pestDetectionService.detectFromImage(imageUrl);
    const detection = await pestDetectionService.saveDetection(userId, imageUrl, result);
    res.json({ success: true, data: detection });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getDetectionHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const history = await pestDetectionService.getDetectionHistory(userId);
    res.json({ success: true, data: history });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
