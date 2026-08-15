import { Request, Response } from 'express';
import { cropJourneyService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';

export const createCropJourney = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    
    let { cropId, cropName, farmId, notes, estimatedHarvest, expectedYieldKg, datePlanted } = req.body;
    
    // If cropId not provided, create a minimal crop entry
    if (!cropId) {
      if (!cropName || !farmId) {
        res.status(400).json({ success: false, error: 'cropId or (cropName + farmId) required' });
        return;
      }
      const newCrop = await (await import('../config/prisma.js')).default.crop.create({
        data: {
          farmId,
          name: cropName,
          plantingDate: datePlanted ? new Date(datePlanted) : new Date(),
        },
      });
      cropId = newCrop.id;
    }
    
    const journey = await cropJourneyService.createCropJourney(userId, { 
      cropId, 
      notes, 
      estimatedHarvest, 
      expectedYieldKg 
    });
    res.status(201).json({ success: true, data: journey });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getCropJourney = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const journey = await cropJourneyService.getById(id);
    res.json({ success: true, data: journey });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
};

export const listCropJourneysForUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const journeys = await cropJourneyService.listForUser(userId);
    res.json({ success: true, data: journeys });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const updateProgress = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { overallProgress, currentStage } = req.body;
    const updated = await cropJourneyService.updateProgress(id, { overallProgress, currentStage });
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const addIrrigationLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { id } = req.params; // journey id
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const { volumeLiters, note } = req.body;
    const log = await cropJourneyService.addIrrigationLog(id, userId, { volumeLiters, note });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const addHealthLog = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { id } = req.params; // journey id
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const { healthScore, nutrientStatus, pestRiskLevel, diseaseRiskLevel, note } = req.body;
    const log = await cropJourneyService.addHealthLog(id, userId, { healthScore, nutrientStatus, pestRiskLevel, diseaseRiskLevel, note });
    res.status(201).json({ success: true, data: log });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getTimeline = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const timeline = await cropJourneyService.getTimeline(id);
    res.json({ success: true, data: timeline });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
};

export default {
  createCropJourney,
  getCropJourney,
  listCropJourneysForUser,
  updateProgress,
  addIrrigationLog,
  addHealthLog,
  getTimeline,
};
