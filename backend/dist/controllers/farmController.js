import { farmService } from '../services/index.js';
export const createFarm = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const farm = await farmService.createFarm(userId, req.body);
        res.status(201).json({ success: true, data: farm });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getFarms = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const farms = await farmService.getFarms(userId);
        res.json({ success: true, data: farms });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getFarmById = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { farmId } = req.params;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const farm = await farmService.getFarmById(farmId, userId);
        res.json({ success: true, data: farm });
    }
    catch (error) {
        res.status(404).json({ success: false, error: error.message });
    }
};
export const addCrop = async (req, res) => {
    try {
        const { farmId } = req.params;
        const crop = await farmService.addCrop(farmId, req.body);
        res.status(201).json({ success: true, data: crop });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getCrops = async (req, res) => {
    try {
        const { farmId } = req.params;
        const crops = await farmService.getCrops(farmId);
        res.json({ success: true, data: crops });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const deleteFarm = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { farmId } = req.params;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        await farmService.deleteFarm(farmId, userId);
        res.json({ success: true, data: { deleted: true } });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
