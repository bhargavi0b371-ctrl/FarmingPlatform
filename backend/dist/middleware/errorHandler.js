export const errorHandler = (error, req, res, next) => {
    res.status(500).json({ success: false, error: error.message });
};
export const notFound = (req, res) => {
    res.status(404).json({ success: false, error: `Route ${req.originalUrl} not found` });
};
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
