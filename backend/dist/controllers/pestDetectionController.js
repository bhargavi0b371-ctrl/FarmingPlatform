import { pestDetectionService } from '../services/index.js';
export const detectPest = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { imageUrl } = req.body;
        if (!imageUrl) {
            res.status(400).json({ success: false, error: 'Image URL required' });
            return;
        }
        const result = await pestDetectionService.detectFromImage(imageUrl);
        const detection = await pestDetectionService.saveDetection(userId, imageUrl, result);
        res.json({ success: true, data: detection });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getDetectionHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const history = await pestDetectionService.getDetectionHistory(userId);
        res.json({ success: true, data: history });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
