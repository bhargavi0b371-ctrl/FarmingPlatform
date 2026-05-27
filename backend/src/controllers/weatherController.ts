import { Request, Response } from 'express';
import { weatherService } from '../services/index.js';

export const getCurrentWeather = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) { res.status(400).json({ success: false, error: 'Lat and lon required' }); return; }
    const weather = await weatherService.getCurrentWeather(parseFloat(lat as string), parseFloat(lon as string));
    res.json({ success: true, data: weather });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getWeatherAlerts = async (req: Request, res: Response): Promise<void> => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) { res.status(400).json({ success: false, error: 'Lat and lon required' }); return; }
    const alerts = await weatherService.getWeatherAlerts(parseFloat(lat as string), parseFloat(lon as string));
    res.json({ success: true, data: alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
