import admin from 'firebase-admin';
import { config } from '../config/index.js';

let initialized = false;
let messaging: admin.messaging.Messaging | null = null;

if (config.firebase.serviceAccountJson) {
  try {
    const serviceAccount = JSON.parse(config.firebase.serviceAccountJson) as admin.ServiceAccount;
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    messaging = admin.messaging();
    initialized = true;
  } catch (error) {
    console.warn('[FCM] Failed to initialize Firebase Admin SDK:', error);
  }
}

export async function sendPushNotification(
  token: string,
  title: string,
  body: string,
  data?: Record<string, string>
): Promise<string | null> {
  if (!initialized || !messaging) {
    console.warn('[FCM] Not initialized. Skipping push notification.');
    return null;
  }
  if (!token) {
    return null;
  }

  const payload: admin.messaging.Message = {
    token,
    notification: { title, body },
    data: data || {},
  };

  return messaging.send(payload);
}
