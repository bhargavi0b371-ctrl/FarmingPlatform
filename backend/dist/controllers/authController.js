import { authService } from '../services/index.js';
export const sendOTP = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            res.status(400).json({ success: false, error: 'Phone required' });
            return;
        }
        const result = await authService.sendOTP(phone);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            res.status(400).json({ success: false, error: 'Phone and OTP required' });
            return;
        }
        const result = await authService.verifyOTP(phone, otp);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
export const register = async (req, res) => {
    try {
        const { phone, name, role, language } = req.body;
        if (!phone || !name) {
            res.status(400).json({ success: false, error: 'Phone and name required' });
            return;
        }
        const result = await authService.register(phone, name, role, language);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const user = await authService.getProfile(userId);
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
export const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const user = await authService.updateProfile(userId, req.body);
        res.json({ success: true, data: user });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
