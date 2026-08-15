import nodemailer from 'nodemailer';
import { config } from '../config/index.js';

const hasSmtpConfig = Boolean(config.email.host && config.email.user && config.email.pass);

const transporter = hasSmtpConfig
  ? nodemailer.createTransport({
      host: config.email.host,
      port: config.email.port,
      secure: config.email.secure,
      auth: {
        user: config.email.user,
        pass: config.email.pass,
      },
    })
  : null;

export async function sendEmail(options: { to: string; subject: string; text: string; html?: string }): Promise<void> {
  if (!transporter) {
    console.warn('[MAIL] SMTP settings not configured. Skipping email send to', options.to);
    return;
  }

  await transporter.sendMail({
    from: config.email.from,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
}
