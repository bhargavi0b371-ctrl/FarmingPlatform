import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';

export const errorHandler = (error: Error, req: Request, res: Response, next: NextFunction): void => {
  res.status(500).json({ success: false, error: error.message } as ApiResponse);
};

export const notFound = (req: Request, res: Response): void => {
  res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` } as ApiResponse);
};

export const asyncHandler = (fn: Function) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
