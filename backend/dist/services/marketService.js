import { supabase } from '../config/supabase.js';
export class MarketService {
    async getMarketPrices(cropName, state, limit = 50) {
        let query = supabase.from('market_prices').select('*').order('price_date', { ascending: false }).limit(limit);
        if (cropName)
            query = query.ilike('crop_name', `%${cropName}%`);
        if (state)
            query = query.eq('state', state);
        const { data, error } = await query;
        if (error)
            throw new Error('Failed to fetch prices');
        return data;
    }
    async getTopCrops() {
        const { data, error } = await supabase.from('market_prices').select('crop_name, modal_price').limit(500);
        if (error || !data)
            return [];
        const stats = {};
        for (const item of data) {
            if (!stats[item.crop_name])
                stats[item.crop_name] = { count: 0, total: 0 };
            stats[item.crop_name].count++;
            stats[item.crop_name].total += item.modal_price;
        }
        return Object.entries(stats)
            .map(([crop, s]) => ({ crop, count: s.count, avgPrice: Math.round(s.total / s.count) }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
    }
}
export default new MarketService();
