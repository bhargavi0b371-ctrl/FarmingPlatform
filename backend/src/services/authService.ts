import { config } from '../config/index.js';
import { prisma } from '../config/prisma.js';
import { generateOTP, formatPhoneNumber, isEmailAddress } from '../utils/helpers.js';
import { sendEmail } from '../utils/email.js';
import jwt from 'jsonwebtoken';
import type { UserRole } from '@prisma/client';

export class AuthService {
  private normalizeContact(contact: string) {
    const trimmed = contact.trim();
    const isEmail = isEmailAddress(trimmed);
    const normalized = isEmail ? trimmed.toLowerCase() : formatPhoneNumber(trimmed);
    return { normalized, isEmail };
  }

  async sendOTP(contact: string): Promise<{ success: boolean; message: string; expiresIn: number }> {
    const { normalized, isEmail } = this.normalizeContact(contact);
    const otp = generateOTP(config.otp.length);
    const expiresAt = new Date(Date.now() + config.otp.expiryMinutes * 60 * 1000);

    await prisma.otpToken.deleteMany({ where: { phone: normalized } });
    await prisma.otpToken.create({
      data: {
        phone: normalized,
        otpCode: otp,
        expiresAt,
      },
    });

    if (isEmail) {
      await sendEmail({
        to: normalized,
        subject: 'Your EcoFarm OTP Code',
        text: `Your EcoFarm OTP is ${otp}. It will expire in ${config.otp.expiryMinutes} minutes.`,
        html: `<p>Your EcoFarm OTP is <strong>${otp}</strong>.</p><p>It will expire in ${config.otp.expiryMinutes} minutes.</p>`,
      });
      return { success: true, message: `OTP sent to ${normalized}`, expiresIn: config.otp.expiryMinutes * 60 };
    }

    console.log('[DEV] OTP for', normalized, ':', otp);
    return { success: true, message: `OTP sent to ${normalized}`, expiresIn: config.otp.expiryMinutes * 60 };
  }

  async verifyOTP(contact: string, otpCode: string): Promise<{ success: boolean; token?: string; user?: unknown; isNewUser?: boolean }> {
    const { normalized, isEmail } = this.normalizeContact(contact);

    const now = new Date();
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        phone: normalized,
        otpCode,
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new Error('Invalid or expired OTP');

    await prisma.otpToken.update({ where: { id: otpRecord.id }, data: { usedAt: now } });

    const existingUser = isEmail
      ? await prisma.user.findUnique({ where: { email: normalized } })
      : await prisma.user.findUnique({ where: { phone: normalized } });

    if (existingUser) {
      await prisma.user.update({ where: { id: existingUser.id }, data: { verified: true } });
      const token = this.generateToken({ id: existingUser.id, contact: normalized, role: existingUser.role });
      return { success: true, token, user: existingUser, isNewUser: false };
    }

    const tempToken = jwt.sign({ contact: normalized, temp: true }, config.jwt.secret, { expiresIn: '10m' });
    return { success: true, token: tempToken, isNewUser: true };
  }

  async devLogin(contact: string): Promise<{ success: boolean; token: string; user: unknown }> {
    if (config.nodeEnv !== 'development') {
      throw new Error('Developer login is only enabled in development mode.');
    }

    const { normalized, isEmail } = this.normalizeContact(contact);
    const allowed = config.dev.allowedLoginContacts.map((value) => value.toLowerCase());
    if (!allowed.includes(normalized.toLowerCase())) {
      throw new Error('This contact is not authorized for development login.');
    }

    const prismaRole: UserRole = 'FARMER';
    const user = await prisma.user.upsert({
      where: isEmail ? { email: normalized } : { phone: normalized },
      update: {
        name: 'Dev Farmer',
        role: prismaRole,
        language: 'en',
        verified: true,
        ...(isEmail ? { email: normalized, phone: normalized } : { phone: normalized }),
      },
      create: {
        name: 'Dev Farmer',
        role: prismaRole,
        language: 'en',
        verified: true,
        ...(isEmail ? { email: normalized, phone: normalized } : { phone: normalized }),
      },
    });

    const token = this.generateToken({ id: user.id, contact: normalized, role: user.role });
    return { success: true, token, user };
  }

  async register(contact: string, name: string, otp: string, role: 'farmer' | 'expert' | 'admin' = 'farmer', language: 'en' | 'ta' | 'hi' | 'te' = 'en'): Promise<{ success: boolean; token: string; user: unknown }> {
    const { normalized, isEmail } = this.normalizeContact(contact);

    const now = new Date();
    const otpRecord = await prisma.otpToken.findFirst({
      where: {
        phone: normalized,
        otpCode: otp,
        usedAt: null,
        expiresAt: { gt: now },
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!otpRecord) throw new Error('Invalid or expired OTP');
    await prisma.otpToken.update({ where: { id: otpRecord.id }, data: { usedAt: now } });

    const prismaRole: UserRole = role === 'admin' ? 'ADMIN' : role === 'expert' ? 'EXPERT' : 'FARMER';
    const user = await prisma.user.upsert({
      where: isEmail ? { email: normalized } : { phone: normalized },
      update: {
        name,
        role: prismaRole,
        language,
        verified: true,
        ...(isEmail ? { email: normalized, phone: normalized } : { phone: normalized }),
      },
      create: {
        name,
        role: prismaRole,
        language,
        verified: true,
        ...(isEmail ? { email: normalized, phone: normalized } : { phone: normalized }),
      },
    });

    const token = this.generateToken({ id: user.id, contact: normalized, role: user.role });
    return { success: true, token, user };
  }

  async getProfile(userId: string): Promise<unknown> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');
    return user;
  }

  async updateProfile(userId: string, updates: { name?: string; email?: string; language?: string; avatarUrl?: string }): Promise<unknown> {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        ...(updates.name !== undefined ? { name: updates.name } : {}),
        ...(updates.email !== undefined ? { email: updates.email } : {}),
        ...(updates.language !== undefined ? { language: updates.language } : {}),
        ...(updates.avatarUrl !== undefined ? { avatarUrl: updates.avatarUrl } : {}),
      },
    });
    return user;
  }

  private generateToken(user: { id: string; contact: string; role: UserRole }): string {
    return jwt.sign(
      { userId: user.id, contact: user.contact, role: user.role },
      config.jwt.secret as string,
      { expiresIn: config.jwt.expiresIn as any }
    );
  }
}

export default new AuthService();
