import { supabase } from '../config/supabase.js';
import { generateUUID } from '../utils/helpers.js';
export class NotificationService {
    async createNotification(userId, data) {
        const { data: notification, error } = await supabase.from('notifications').insert({
            id: generateUUID(),
            user_id: userId,
            title: data.title,
            message: data.message,
            notification_type: data.type,
            priority: data.priority || 'normal',
            is_read: false,
        }).select().maybeSingle();
        if (error)
            throw new Error('Failed to create notification');
        return notification;
    }
    async getNotifications(userId, isRead) {
        let query = supabase.from('notifications').select('*').eq('user_id', userId).order('created_at', { ascending: false });
        if (isRead !== undefined)
            query = query.eq('is_read', isRead);
        const { data, error } = await query;
        if (error)
            throw new Error('Failed to fetch notifications');
        return data;
    }
    async markAsRead(notificationId, userId) {
        const { data, error } = await supabase.from('notifications').update({ is_read: true, read_at: new Date().toISOString() }).eq('id', notificationId).eq('user_id', userId).select().maybeSingle();
        if (error || !data)
            throw new Error('Failed to update');
        return data;
    }
    async getUnreadCount(userId) {
        const { count } = await supabase.from('notifications').select('*', { count: 'exact', head: true }).eq('user_id', userId).eq('is_read', false);
        return count || 0;
    }
}
export default new NotificationService();
