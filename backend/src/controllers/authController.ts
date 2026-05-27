import { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';

export const sendOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone } = req.body;
    if (!phone) { res.status(400).json({ success: false, error: 'Phone required' }); return; }
    const result = await authService.sendOTP(phone);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const verifyOTP = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, otp } = req.body;
    if (!phone || !otp) { res.status(400).json({ success: false, error: 'Phone and OTP required' }); return; }
    const result = await authService.verifyOTP(phone, otp);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
};

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { phone, name, role, language } = req.body;
    if (!phone || !name) { res.status(400).json({ success: false, error: 'Phone and name required' }); return; }
    const result = await authService.register(phone, name, role, language);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const user = await authService.getProfile(userId);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(404).json({ success: false, error: (error as Error).message });
  }
};

export const updateProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const user = await authService.updateProfile(userId, req.body);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
