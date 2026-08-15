import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/index.js';
import { JwtPayload, ApiResponse } from '../types/index.js';
import { prisma } from '../config/prisma.js';

export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export const authenticate = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: 'Access denied. No token provided.' } as ApiResponse);
      return;
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JwtPayload;
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, phone: true, role: true, verified: true },
    });
    if (!user) {
      res.status(401).json({ success: false, error: 'Invalid token.' } as ApiResponse);
      return;
    }
    (req as AuthRequest).user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, error: 'Invalid token.' } as ApiResponse);
  }
};

export const authorize = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user || !roles.includes(user.role)) {
      res.status(403).json({ success: false, error: 'Access denied.' } as ApiResponse);
      return;
    }
    next();
  };
};
