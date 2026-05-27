import { Request, Response } from 'express';
import { advisoryService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';

export const getAdvisories = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const advisories = await advisoryService.getAdvisories(userId, req.query as any);
    res.json({ success: true, data: advisories });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const generateCropRecommendations = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const recommendations = await advisoryService.generateCropRecommendations(req.body);
    for (const advisory of recommendations) {
      await advisoryService.saveAdvisory(advisory, userId);
    }
    res.json({ success: true, data: recommendations });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const generateAIAdvisory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const { prompt } = req.body;
    const response = await advisoryService.generateAIAdvisory(userId, prompt);
    res.json({ success: true, data: { response } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
