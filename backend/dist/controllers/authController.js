import { authService } from '../services/index.js';
export const sendOTP = async (req, res) => {
    try {
        const { contact } = req.body;
        if (!contact) {
            res.status(400).json({ success: false, error: 'Contact is required' });
            return;
        }
        const result = await authService.sendOTP(contact);
        res.json({ success: true, data: result });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const verifyOTP = async (req, res) => {
    try {
        const { contact, otp } = req.body;
        if (!contact || !otp) {
            res.status(400).json({ success: false, error: 'Contact and OTP required' });
            return;
        }
        const result = await authService.verifyOTP(contact, otp);
        res.json({ success: true, token: result.token, user: result.user, isNewUser: result.isNewUser });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
export const login = async (req, res) => {
    try {
        const { contact } = req.body;
        if (!contact) {
            res.status(400).json({ success: false, error: 'Contact is required' });
            return;
        }
        const result = await authService.devLogin(contact);
        res.json({ success: true, token: result.token, user: result.user });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
    }
};
export const register = async (req, res) => {
    try {
        const { contact, name, otp, role, language } = req.body;
        if (!contact || !name || !otp) {
            res.status(400).json({ success: false, error: 'Contact, name and OTP required' });
            return;
        }
        const result = await authService.register(contact, name, otp, role, language);
        res.status(201).json({ success: true, data: result });
    }
    catch (error) {
        res.status(400).json({ success: false, error: error.message });
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
