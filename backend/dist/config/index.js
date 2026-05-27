import dotenv from 'dotenv';
dotenv.config();
export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    supabase: {
        url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
        anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || '',
        serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    },
    jwt: {
        secret: process.env.JWT_SECRET || 'default-secret-change-in-production',
        expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
    otp: {
        expiryMinutes: parseInt(process.env.OTP_EXPIRY_MINUTES || '5', 10),
        length: parseInt(process.env.OTP_LENGTH || '6', 10),
    },
    openweather: {
        apiKey: process.env.OPENWEATHER_API_KEY || '',
        baseUrl: process.env.OPENWEATHER_BASE_URL || 'https://api.openweathermap.org/data/2.5',
    },
    ai: {
        openaiKey: process.env.OPENAI_API_KEY || '',
        geminiKey: process.env.GEMINI_API_KEY || '',
        model: process.env.AI_MODEL || 'gpt-4',
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
};
