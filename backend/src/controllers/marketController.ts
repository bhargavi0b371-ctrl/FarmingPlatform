import { Request, Response } from 'express';
import { marketService } from '../services/index.js';

export const getMarketPrices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { crop, state, limit } = req.query;
    const prices = await marketService.getMarketPrices(crop as string, state as string, limit ? parseInt(limit as string) : 50);
    res.json({ success: true, data: prices });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getTopCrops = async (req: Request, res: Response): Promise<void> => {
  try {
    const crops = await marketService.getTopCrops();
    res.json({ success: true, data: crops });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
