import { supabase } from '../config/supabase.js';
import { Advisory, Farm, Crop, WeatherLog } from '../types/index.js';
import { generateUUID, getSeason, cropRecommendations } from '../utils/helpers.js';
import { config } from '../config/index.js';

export class AdvisoryService {
  async generateCropRecommendations(context: { farmId: string; soilType?: string }): Promise<Advisory[]> {
    const season = getSeason(new Date());
    const soilType = context.soilType || 'loamy';
    const advisories: Advisory[] = [];

    for (const [cropName, req] of Object.entries(cropRecommendations)) {
      if (req.season.includes(season) && (req.soil.includes(soilType) || req.soil.length === 0)) {
        advisories.push({
          id: generateUUID(),
          user_id: '',
          farm_id: context.farmId,
          advisory_type: 'crop_recommendation',
          title: `${cropName} Recommended`,
          content: `${cropName} is suitable for ${season} in ${soilType} soil.`,
          priority: 'normal',
          is_read: false,
          action_taken: false,
          valid_from: new Date(),
          metadata: { crop: cropName },
          created_at: new Date(),
        });
      }
    }
    return advisories.slice(0, 5);
  }

  async getAdvisories(userId: string, filters?: { type?: string; limit?: number }): Promise<Advisory[]> {
    let query = supabase.from('advisories').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (filters?.type) query = query.eq('advisory_type', filters.type);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw new Error('Failed to fetch advisories');
    return data as Advisory[];
  }

  async saveAdvisory(advisory: Advisory, userId: string): Promise<Advisory> {
    const { data, error } = await supabase.from('advisories').insert({ ...advisory, user_id: userId }).select().maybeSingle();
    if (error) throw new Error('Failed to save advisory');
    return data as Advisory;
  }

  async generateAIAdvisory(userId: string, prompt: string): Promise<string> {
    if (!config.ai.openaiKey) {
      return 'Please add your farm details for personalized advice. I can help with crop recommendations, pest control, and irrigation scheduling.';
    }
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${config.ai.openaiKey}` },
        body: JSON.stringify({
          model: config.ai.model,
          messages: [
            { role: 'system', content: 'You are an expert agricultural advisor for Indian farmers.' },
            { role: 'user', content: prompt },
          ],
          max_tokens: 200,
        }),
      });
      const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> };
      return data.choices?.[0]?.message?.content || 'Unable to generate advice.';
    } catch {
      return 'Please try again later.';
    }
  }
}

export default new AdvisoryService();
