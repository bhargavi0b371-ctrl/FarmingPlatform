import { advisoryService } from '../services/index.js';
export const getAdvisories = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const advisories = await advisoryService.getAdvisories(userId, req.query);
        res.json({ success: true, data: advisories });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const generateCropRecommendations = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const recommendations = await advisoryService.generateCropRecommendations(req.body);
        for (const advisory of recommendations) {
            await advisoryService.saveAdvisory(advisory, userId);
        }
        res.json({ success: true, data: recommendations });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const generateAIAdvisory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { prompt } = req.body;
        const response = await advisoryService.generateAIAdvisory(userId, prompt);
        res.json({ success: true, data: { response } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
