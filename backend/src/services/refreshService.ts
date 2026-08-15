import { config } from '../config/index.js';
import { supabase } from '../config/supabase.js';
import { prisma } from '../config/prisma.js';
import weatherService from './weatherService.js';
import aiService from './aiService.js';
import notificationService from './notificationService.js';
import { sendPushNotification } from '../utils/fcm.js';

interface AgmarknetRecord {
  crop_name: string;
  mandi_name: string;
  state: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  arrival_qty?: number;
  price_date?: string;
}

export class RefreshService {
  private normalizeMarketItem(item: any): AgmarknetRecord {
    return {
      crop_name: item.commodity || item.crop || item.crop_name || item.commodity_name || 'Unknown',
      mandi_name: item.market || item.mandi_name || item.mandi || 'Unknown',
      state: item.state || item.region || item.district || 'Unknown',
      min_price: Number(item.min_price ?? item.low_price ?? item.min_price_per_unit ?? 0),
      max_price: Number(item.max_price ?? item.high_price ?? item.max_price_per_unit ?? 0),
      modal_price: Number(item.modal_price ?? item.modal_price_per_unit ?? item.modal ?? 0),
      unit: item.unit || item.price_unit || 'kg',
      arrival_qty: item.arrival_qty ? Number(item.arrival_qty) : undefined,
      price_date: item.price_date || item.date || new Date().toISOString(),
    };
  }

  async refreshWeatherData(): Promise<void> {
    if (!config.openweather.apiKey) {
      console.warn('[RefreshService] OpenWeather API key is not configured. Skipping weather refresh.');
      return;
    }

    const rows = [];
    for (const location of config.weather.locations) {
      try {
        const data = await weatherService.getCurrentWeather(location.lat, location.lon);
        rows.push({
          location_name: location.name,
          latitude: data.latitude,
          longitude: data.longitude,
          temperature_c: data.temperature_c ?? null,
          temperature_min_c: data.temperature_min_c ?? null,
          temperature_max_c: data.temperature_max_c ?? null,
          humidity_percent: data.humidity_percent ?? null,
          wind_speed_kmh: data.wind_speed_kmh ?? null,
          wind_direction: data.wind_direction ?? null,
          rainfall_mm: data.rainfall_mm ?? null,
          cloud_cover_percent: data.cloud_cover_percent ?? null,
          weather_condition: data.weather_condition ?? null,
          weather_icon: data.weather_icon ?? null,
          forecast_date: data.forecast_date.toISOString(),
          created_at: new Date().toISOString(),
          source: 'openweather',
        });
      } catch (error) {
        console.warn('[RefreshService] Weather refresh failed for', location.name, error);
      }
    }

    if (rows.length > 0) {
      await supabase.from('weather_logs').insert(rows);
    }
  }

  async refreshMarketData(): Promise<void> {
    if (!config.market.sourceUrl) {
      console.warn('[RefreshService] Market source URL is not configured. Skipping market refresh.');
      return;
    }

    try {
      const response = await fetch(config.market.sourceUrl, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Market source returned ${response.status}`);
      const payload = await response.json();
      const records = Array.isArray(payload)
        ? payload
        : payload.records ?? payload.data ?? payload.items ?? [];

      const rows = (records as any[])
        .map((item) => this.normalizeMarketItem(item))
        .filter((item) => item.crop_name && item.mandi_name && item.modal_price > 0)
        .map((item) => ({
          crop_name: item.crop_name,
          mandi_name: item.mandi_name,
          state: item.state,
          min_price: item.min_price,
          max_price: item.max_price,
          modal_price: item.modal_price,
          unit: item.unit,
          arrival_qty: item.arrival_qty,
          price_date: item.price_date,
          created_at: new Date().toISOString(),
          source: 'agmarknet',
        }));

      if (rows.length > 0) {
        await supabase.from('market_prices').insert(rows);
      }
    } catch (error) {
      console.warn('[RefreshService] Market refresh failed', error);
    }
  }

  async syncGovernmentWeatherData(): Promise<void> {
    if (!config.weather.governmentSourceUrl) {
      return;
    }

    try {
      const response = await fetch(config.weather.governmentSourceUrl, { headers: { Accept: 'application/json' } });
      if (!response.ok) throw new Error(`Government source returned ${response.status}`);
      const payload = await response.json();
      await supabase.from('government_weather').insert({ data: payload, fetched_at: new Date().toISOString() });
    } catch (error) {
      console.warn('[RefreshService] Government weather refresh failed', error);
    }
  }

  async deliverSmartAlerts(): Promise<void> {
    const weatherResult = await supabase.from('weather_logs').select('*').order('created_at', { ascending: false }).limit(50);
    const priceResult = await supabase.from('market_prices').select('*').order('created_at', { ascending: false }).limit(200);

    if (weatherResult.error || priceResult.error) {
      console.warn('[RefreshService] Failed to load source data for alerts.');
      return;
    }

    const weatherRows = weatherResult.data ?? [];
    const marketRows = priceResult.data ?? [];

    await this.createWeatherAlerts(weatherRows);
    await this.createMarketAlerts(marketRows);
    await this.createCropAndIrrigationAlerts();
  }

  private async createWeatherAlerts(weatherRows: any[]): Promise<void> {
    const recentWeatherByLocation = new Map<string, any>();
    for (const row of weatherRows) {
      if (!recentWeatherByLocation.has(row.location_name)) {
        recentWeatherByLocation.set(row.location_name, row);
      }
    }

    for (const [location, weather] of recentWeatherByLocation.entries()) {
      if ((weather.rainfall_mm || 0) >= 50) {
        await this.notifyAllUsers(
          `Heavy rain expected in ${location}`,
          `Heavy rain is forecast for ${location} soon. Please delay irrigation and protect vulnerable crops.`,
          'weather'
        );
      }
      if ((weather.temperature_c || 0) >= 40) {
        await this.notifyAllUsers(
          `Heat alert for ${location}`,
          `High temperatures are expected in ${location}. Keep crops hydrated and avoid water stress.`,
          'weather'
        );
      }
    }
  }

  private async createMarketAlerts(marketRows: any[]): Promise<void> {
    const grouped: Record<string, any[]> = {};
    for (const row of marketRows) {
      const key = `${row.crop_name}|${row.state || 'unknown'}`;
      grouped[key] = grouped[key] || [];
      grouped[key].push(row);
    }

    for (const values of Object.values(grouped)) {
      if (values.length < 2) continue;
      const [latest, previous] = values.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 2);
      const latestPrice = Number(latest.modal_price || latest.price_per_unit || 0);
      const previousPrice = Number(previous.modal_price || previous.price_per_unit || 0);
      if (previousPrice > 0) {
        const change = ((latestPrice - previousPrice) / previousPrice) * 100;
        if (Math.abs(change) >= 8) {
          const direction = change > 0 ? 'increased' : 'decreased';
          await this.notifyAllUsers(
            `${latest.crop_name} market price ${direction}`,
            `${latest.crop_name} price has ${direction} by ${change.toFixed(1)}% in ${latest.state}. Review harvest or storage plans.`,
            'market'
          );
        }
      }
    }
  }

  private async createCropAndIrrigationAlerts(): Promise<void> {
    const journeys = await prisma.cropJourney.findMany({
      where: { currentStage: { in: ['GERMINATION', 'EARLY_GROWTH', 'VEGETATIVE'] } },
      include: {
        crop: {
          include: {
            farm: {
              select: { userId: true },
            },
          },
        },
        stages: true,
      },
    });

    for (const journey of journeys) {
      const cropName = journey.crop?.name || 'Crop';
      const userId = journey.crop?.farm?.userId;
      if (!userId) continue;
      if (journey.currentStage === 'VEGETATIVE') {
        await notificationService.createNotification(userId, {
          title: `${cropName} may enter flowering stage soon`,
          message: `Monitor ${cropName} carefully; it is nearing flowering stage and may require fertilizer or water adjustments.`,
          type: 'advisory',
          priority: 'high',
        });
      }

      const lastIrrigation = await prisma.irrigationLog.findFirst({
        where: { journeyId: journey.id },
        orderBy: { irrigatedAt: 'desc' },
      });
      const thresholdDate = new Date(Date.now() - 24 * 60 * 60 * 1000);
      if (!lastIrrigation || new Date(lastIrrigation.irrigatedAt) < thresholdDate) {
        await notificationService.createNotification(userId, {
          title: `Irrigation reminder for ${cropName}`,
          message: `It has been more than 24 hours since the last irrigation. Check soil moisture and irrigate if needed.`,
          type: 'advisory',
          priority: 'high',
        });
      }
    }
  }

  private async notifyAllUsers(title: string, message: string, type: 'weather' | 'market' | 'advisory'): Promise<void> {
    type NotifiedUser = { id: string; fcmToken?: string };
    const users = await prisma.user.findMany({ where: { verified: true } }) as NotifiedUser[];
    for (const user of users) {
      await notificationService.createNotification(user.id, {
        title,
        message,
        type,
        priority: 'high',
      });
      if (user.fcmToken) {
        await sendPushNotification(user.fcmToken, title, message, { type, source: 'backend' });
      }
    }
  }

  async generateAiInsights(): Promise<void> {
    const journeys = await prisma.cropJourney.findMany({
      where: { currentStage: { in: ['VEGETATIVE', 'FLOWERING', 'FRUITING'] } },
      include: {
        crop: {
          include: {
            farm: {
              select: { userId: true },
            },
          },
        },
      },
      take: 20,
    });

    for (const journey of journeys) {
      const userId = journey.crop?.farm?.userId;
      const cropName = journey.crop?.name || 'Crop';
      if (!userId) continue;

      const latestWeather = await supabase.from('weather_logs').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();
      const latestMarket = await supabase.from('market_prices').select('*').order('created_at', { ascending: false }).limit(1).maybeSingle();

      if (!latestWeather.data || !latestMarket.data) continue;

      const weatherSummary = `${latestWeather.data.weather_condition || 'Unknown'} with ${latestWeather.data.temperature_c ?? 0}°C and ${latestWeather.data.rainfall_mm ?? 0}mm rain.`;
      const marketSummary = `${latestMarket.data.crop_name} modal price is ₹${(latestMarket.data.modal_price ?? latestMarket.data.price_per_unit) || 0} in ${latestMarket.data.state}.`;

      try {
        const insight = await aiService.generateAgricultureInsight({
          weatherSummary,
          cropType: cropName,
          growthStage: journey.currentStage,
          marketSummary,
        });

        await notificationService.createNotification(userId, {
          title: `AI insight for ${cropName}`,
          message: insight,
          type: 'advisory',
          priority: 'normal',
        });
      } catch (error) {
        console.warn('[RefreshService] AI insight generation failed', error);
      }
    }
  }
}

export default new RefreshService();
