import { supabase } from '../config/supabase.js';
import { config } from '../config/index.js';
import { generateOTP, formatPhoneNumber, generateUUID } from '../utils/helpers.js';
import jwt from 'jsonwebtoken';
import { User } from '../types/index.js';

export class AuthService {
  async sendOTP(phone: string): Promise<{ success: boolean; message: string; expiresIn: number }> {
    const formattedPhone = formatPhoneNumber(phone);
    const otp = generateOTP(config.otp.length);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    await supabase.from('otp_tokens').delete().eq('phone', formattedPhone);

    const { error } = await supabase.from('otp_tokens').insert({
      id: generateUUID(),
      phone: formattedPhone,
      otp_code: otp,
      expires_at: expiresAt,
      is_used: false,
    });

    if (error) throw new Error('Failed to generate OTP');
    console.log('[DEV] OTP for', formattedPhone, ':', otp);

    return { success: true, message: `OTP sent to ${formattedPhone}`, expiresIn: config.otp.expiryMinutes * 60 };
  }

  async verifyOTP(phone: string, otpCode: string): Promise<{ success: boolean; token?: string; user?: User; isNewUser?: boolean }> {
    const formattedPhone = formatPhoneNumber(phone);

    const { data: otpRecord } = await supabase
      .from('otp_tokens')
      .select('*')
      .eq('phone', formattedPhone)
      .eq('otp_code', otpCode)
      .eq('is_used', false)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();

    if (!otpRecord) throw new Error('Invalid or expired OTP');

    await supabase.from('otp_tokens').update({ is_used: true }).eq('id', otpRecord.id);

    const { data: existingUser } = await supabase.from('users').select('*').eq('phone', formattedPhone).maybeSingle();

    if (existingUser) {
      await supabase.from('users').update({ is_verified: true, last_login: new Date().toISOString() }).eq('id', existingUser.id);
      const token = this.generateToken(existingUser);
      return { success: true, token, user: existingUser, isNewUser: false };
    }

    const tempToken = jwt.sign({ phone: formattedPhone, temp: true }, config.jwt.secret, { expiresIn: '10m' });
    return { success: true, token: tempToken, isNewUser: true };
  }

  async register(phone: string, name: string, role: 'farmer' | 'expert' | 'admin' = 'farmer', language: 'en' | 'ta' | 'hi' | 'te' = 'en'): Promise<{ success: boolean; token: string; user: User }> {
    const formattedPhone = formatPhoneNumber(phone);
    const { data: newUser, error } = await supabase.from('users').insert({
      id: generateUUID(),
      phone: formattedPhone,
      name,
      role,
      language,
      is_verified: true,
      is_active: true,
    }).select().single();

    if (error) throw new Error('Failed to create account');
    const token = this.generateToken(newUser);
    return { success: true, token, user: newUser };
  }

  async getProfile(userId: string): Promise<User> {
    const { data: user, error } = await supabase.from('users').select('*').eq('id', userId).maybeSingle();
    if (error || !user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, updates: Partial<User>): Promise<User> {
    const allowed = ['name', 'email', 'language', 'profile_image', 'preferences'];
    const filtered: Record<string, unknown> = { updated_at: new Date().toISOString() };
    for (const key of allowed) {
      if (updates[key as keyof User] !== undefined) filtered[key] = updates[key as keyof User];
    }
    const { data, error } = await supabase.from('users').update(filtered).eq('id', userId).select().single();
    if (error) throw new Error('Failed to update profile');
    return data;
  }

  private generateToken(user: User): string {
    return jwt.sign({ userId: user.id, phone: user.phone, role: user.role }, config.jwt.secret, { expiresIn: '7d' });
  }
}

export default new AuthService();
