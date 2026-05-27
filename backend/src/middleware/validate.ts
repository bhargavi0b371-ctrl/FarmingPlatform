import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import { ApiResponse } from '../types/index.js';

export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (errors.isEmpty()) { next(); return; }
  res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() } as ApiResponse);
};
