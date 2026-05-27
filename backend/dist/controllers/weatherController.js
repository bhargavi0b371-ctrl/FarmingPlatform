import { weatherService } from '../services/index.js';
export const getCurrentWeather = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            res.status(400).json({ success: false, error: 'Lat and lon required' });
            return;
        }
        const weather = await weatherService.getCurrentWeather(parseFloat(lat), parseFloat(lon));
        res.json({ success: true, data: weather });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getWeatherAlerts = async (req, res) => {
    try {
        const { lat, lon } = req.query;
        if (!lat || !lon) {
            res.status(400).json({ success: false, error: 'Lat and lon required' });
            return;
        }
        const alerts = await weatherService.getWeatherAlerts(parseFloat(lat), parseFloat(lon));
        res.json({ success: true, data: alerts });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
