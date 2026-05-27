import { validationResult } from 'express-validator';
export const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        next();
        return;
    }
    res.status(400).json({ success: false, error: 'Validation failed', data: errors.array() });
};
