import { supabase } from '../config/supabase.js';
import { Farm, Crop, SoilReport } from '../types/index.js';
import { generateUUID } from '../utils/helpers.js';

export class FarmService {
  async createFarm(userId: string, data: Omit<Farm, 'id' | 'user_id' | 'is_active' | 'created_at' | 'updated_at'>): Promise<Farm> {
    const { data: farm, error } = await supabase.from('farms').insert({
      id: generateUUID(),
      user_id: userId,
      ...data,
      is_active: true,
    }).select().maybeSingle();
    if (error) throw new Error('Failed to create farm');
    return farm as Farm;
  }

  async getFarms(userId: string): Promise<Farm[]> {
    const { data, error } = await supabase.from('farms').select('*').eq('user_id', userId).eq('is_active', true);
    if (error) throw new Error('Failed to fetch farms');
    return data as Farm[];
  }

  async getFarmById(farmId: string, userId: string): Promise<Farm> {
    const { data, error } = await supabase.from('farms').select('*').eq('id', farmId).eq('user_id', userId).maybeSingle();
    if (error || !data) throw new Error('Farm not found');
    return data as Farm;
  }

  async addCrop(farmId: string, data: Omit<Crop, 'id' | 'farm_id' | 'created_at' | 'updated_at'>): Promise<Crop> {
    const { data: crop, error } = await supabase.from('crops').insert({ id: generateUUID(), farm_id: farmId, ...data }).select().maybeSingle();
    if (error) throw new Error('Failed to add crop');
    return crop as Crop;
  }

  async getCrops(farmId: string): Promise<Crop[]> {
    const { data, error } = await supabase.from('crops').select('*').eq('farm_id', farmId);
    if (error) throw new Error('Failed to fetch crops');
    return data as Crop[];
  }
}

export default new FarmService();
