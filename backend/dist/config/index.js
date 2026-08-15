import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();
const parseJsonEnv = (value, fallback) => {
    if (!value)
        return fallback;
    try {
        return JSON.parse(value);
    }
    catch {
        return fallback;
    }
};
export const config = {
    port: parseInt(process.env.PORT || '3001', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    supabase: {
        url: process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || 'http://localhost:5432',
        anonKey: process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_SUPABASE_ANON_KEY || 'public-anon-key',
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
    openMeteo: {
        baseUrl: process.env.OPENMETEO_BASE_URL || 'https://api.open-meteo.com/v1',
        defaultLatitude: parseFloat(process.env.OPENMETEO_LATITUDE || '12.9716'),
        defaultLongitude: parseFloat(process.env.OPENMETEO_LONGITUDE || '77.5946'),
    },
    market: {
        sourceUrl: process.env.AGMARKNET_API_URL || process.env.MARKET_SOURCE_URL || '',
        updateIntervalHours: parseInt(process.env.MARKET_UPDATE_HOURS || '6', 10),
    },
    weather: {
        updateIntervalHours: parseInt(process.env.WEATHER_UPDATE_HOURS || '1', 10),
        locations: parseJsonEnv(process.env.WEATHER_LOCATIONS, [
            { name: 'Bengaluru', lat: 12.9716, lon: 77.5946 },
        ]),
        governmentSourceUrl: process.env.GOVERNMENT_WEATHER_URL || '',
    },
    firebase: {
        serviceAccountJson: (() => {
            const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
            const path = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_PATH;
            const b64 = process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
            if (raw && raw.trim())
                return raw;
            if (path && path.trim()) {
                try {
                    return fs.readFileSync(path, 'utf8');
                }
                catch (err) {
                    console.warn('Failed to read FIREBASE_SERVICE_ACCOUNT_JSON_PATH:', err);
                }
            }
            if (b64 && b64.trim()) {
                try {
                    return Buffer.from(b64, 'base64').toString('utf8');
                }
                catch (err) {
                    console.warn('Failed to decode FIREBASE_SERVICE_ACCOUNT_JSON_B64:', err);
                }
            }
            return '';
        })(),
    },
    maps: {
        baseUrl: process.env.OPENSTREETMAP_BASE_URL || 'https://nominatim.openstreetmap.org',
        userAgent: process.env.OPENSTREETMAP_USER_AGENT || 'EcoFarmApp/1.0',
    },
    email: {
        host: process.env.SMTP_HOST || '',
        port: parseInt(process.env.SMTP_PORT || '587', 10),
        secure: process.env.SMTP_SECURE === 'true',
        user: process.env.SMTP_USER || '',
        pass: process.env.SMTP_PASS || '',
        from: process.env.EMAIL_FROM || 'noreply@ecofarm.app',
    },
    dev: {
        allowedLoginContacts: (process.env.DEV_LOGIN_CONTACTS || 'demo@example.com,+919876543210')
            .split(',')
            .map((value) => value.trim())
            .filter(Boolean),
    },
    ai: {
        geminiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_AI_STUDIO_API_KEY || '',
        model: process.env.AI_MODEL || 'gemini-pro',
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:3000',
    },
};
