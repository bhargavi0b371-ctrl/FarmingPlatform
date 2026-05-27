import { Request, Response } from 'express';
import { notificationService } from '../services/index.js';
import { AuthRequest } from '../middleware/index.js';

export const getNotifications = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const notifications = await notificationService.getNotifications(userId, req.query.isRead === 'true' ? true : req.query.isRead === 'false' ? false : undefined);
    res.json({ success: true, data: notifications });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const markAsRead = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    const { notificationId } = req.params;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const notification = await notificationService.markAsRead(notificationId, userId);
    res.json({ success: true, data: notification });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};

export const getUnreadCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = (req as AuthRequest).user?.userId;
    if (!userId) { res.status(401).json({ success: false, error: 'Unauthorized' }); return; }
    const count = await notificationService.getUnreadCount(userId);
    res.json({ success: true, data: { count } });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
};
