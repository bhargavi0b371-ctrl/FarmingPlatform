import { supabase } from '../config/supabase.js';
import { generateUUID } from '../utils/helpers.js';
export class FarmService {
    async createFarm(userId, data) {
        const { data: farm, error } = await supabase.from('farms').insert({
            id: generateUUID(),
            user_id: userId,
            ...data,
            is_active: true,
        }).select().maybeSingle();
        if (error)
            throw new Error('Failed to create farm');
        return farm;
    }
    async getFarms(userId) {
        const { data, error } = await supabase.from('farms').select('*').eq('user_id', userId).eq('is_active', true);
        if (error)
            throw new Error('Failed to fetch farms');
        return data;
    }
    async getFarmById(farmId, userId) {
        const { data, error } = await supabase.from('farms').select('*').eq('id', farmId).eq('user_id', userId).maybeSingle();
        if (error || !data)
            throw new Error('Farm not found');
        return data;
    }
    async addCrop(farmId, data) {
        const { data: crop, error } = await supabase.from('crops').insert({ id: generateUUID(), farm_id: farmId, ...data }).select().maybeSingle();
        if (error)
            throw new Error('Failed to add crop');
        return crop;
    }
    async getCrops(farmId) {
        const { data, error } = await supabase.from('crops').select('*').eq('farm_id', farmId);
        if (error)
            throw new Error('Failed to fetch crops');
        return data;
    }
}
export default new FarmService();
