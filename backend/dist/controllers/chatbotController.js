import { chatbotService } from '../services/index.js';
export const sendMessage = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const { message, language, sessionId } = req.body;
        if (!message) {
            res.status(400).json({ success: false, error: 'Message required' });
            return;
        }
        const response = await chatbotService.processMessage(userId, message, language || 'en', sessionId);
        res.json({ success: true, data: response });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
export const getChatHistory = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId) {
            res.status(401).json({ success: false, error: 'Unauthorized' });
            return;
        }
        const history = await chatbotService.getChatHistory(userId);
        res.json({ success: true, data: history });
    }
    catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};
