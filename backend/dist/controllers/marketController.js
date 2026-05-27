import { marketService } from '../services/index.js';
export const getMarketPrices = async (req, res) => {
    try {
        const { crop, state, limit } = req.query;
        const prices = await marketService.getMarketPrices(crop, state, limit ? parseInt(limit) : 50);
        res.json({ success: true, data: prices });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getTopCrops = async (req, res) => {
    try {
        const crops = await marketService.getTopCrops();
        res.json({ success: true, data: crops });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
