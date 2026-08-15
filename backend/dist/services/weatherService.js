import { config } from '../config/index.js';
import { generateUUID } from '../utils/helpers.js';
export class WeatherService {
    apiKey = config.openweather.apiKey;
    baseUrl = config.openweather.baseUrl;
    async fetchWithRetry(url, attempts = 3, delayMs = 800) {
        let lastError;
        for (let i = 0; i < attempts; i++) {
            try {
                const res = await fetch(url);
                return res;
            }
            catch (err) {
                lastError = err;
                // small backoff
                await new Promise((r) => setTimeout(r, delayMs));
            }
        }
        throw lastError;
    }
    async getCurrentWeather(lat, lon) {
        if (!this.apiKey)
            throw new Error('OpenWeather API key is not configured');
        const url = `${this.baseUrl}/weather?lat=${lat}&lon=${lon}&appid=${this.apiKey}&units=metric`;
        let response;
        try {
            response = await this.fetchWithRetry(url, 3, 800);
        }
        catch (err) {
            throw new Error(`Failed to fetch weather (network): ${err?.message ?? String(err)}`);
        }
        if (!response.ok) {
            const body = await response.text().catch(() => '<no body>');
            throw new Error(`Failed to fetch weather: ${response.status} ${response.statusText} - ${body}`);
        }
        const data = (await response.json());
        return {
            id: generateUUID(),
            latitude: lat,
            longitude: lon,
            temperature_c: data.main?.temp,
            temperature_min_c: data.main?.temp_min,
            temperature_max_c: data.main?.temp_max,
            humidity_percent: data.main?.humidity,
            pressure_hpa: data.main?.pressure,
            wind_speed_kmh: data.wind ? data.wind.speed * 3.6 : undefined,
            wind_direction: data.wind?.deg,
            rainfall_mm: data.rain?.['1h'] || 0,
            visibility_km: data.visibility ? data.visibility / 1000 : undefined,
            cloud_cover_percent: data.clouds?.all,
            weather_condition: data.weather?.[0]?.main,
            weather_icon: data.weather?.[0]?.icon,
            sunrise_time: data.sys?.sunrise ? new Date(data.sys.sunrise * 1000).toLocaleTimeString() : undefined,
            sunset_time: data.sys?.sunset ? new Date(data.sys.sunset * 1000).toLocaleTimeString() : undefined,
            forecast_date: new Date(),
            created_at: new Date(),
        };
    }
    async getWeatherAlerts(lat, lon) {
        const weather = await this.getCurrentWeather(lat, lon);
        const alerts = [];
        if ((weather.rainfall_mm || 0) > 50) {
            alerts.push({ type: 'heavy_rain', severity: 'high', message: 'Heavy rainfall expected.' });
        }
        if ((weather.temperature_c || 0) > 40) {
            alerts.push({ type: 'heat_wave', severity: 'urgent', message: 'Extreme heat alert.' });
        }
        return alerts;
    }
}
export default new WeatherService();
