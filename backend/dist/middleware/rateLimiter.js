import rateLimit from 'express-rate-limit';
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, error: 'Too many requests.' },
});
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { success: false, error: 'Too many attempts.' },
});
export const chatLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 20,
    message: { success: false, error: 'Too many messages.' },
});
