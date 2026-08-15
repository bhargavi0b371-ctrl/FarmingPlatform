const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...options.headers,
      },
    });
    const data = await response.json();
    if (!response.ok) return { success: false, error: data.error || 'Request failed' };
    return { success: true, data: data.data };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

export const api = {
  health: {
    getStatus: () => fetchApi('/health'),
  },
  auth: {
    sendOTP: (phone: string) => fetchApi('/auth/send-otp', { method: 'POST', body: JSON.stringify({ phone }) }),
    verifyOTP: (phone: string, otp: string) => fetchApi('/auth/verify-otp', { method: 'POST', body: JSON.stringify({ phone, otp }) }),
    getProfile: () => fetchApi('/auth/profile'),
    updateProfile: (data: Record<string, unknown>) => fetchApi('/auth/profile', { method: 'PUT', body: JSON.stringify(data) }),
  },
  weather: {
    getCurrent: (lat: number, lon: number) => fetchApi(`/weather/current?lat=${lat}&lon=${lon}`),
    getAlerts: (lat: number, lon: number) => fetchApi(`/weather/alerts?lat=${lat}&lon=${lon}`),
  },
  market: {
    getPrices: (crop?: string) => fetchApi(`/market${crop ? `?crop=${crop}` : ''}`),
    getTopCrops: () => fetchApi('/market/top-crops'),
  },
  farms: {
    getAll: () => fetchApi('/farms'),
    create: (data: Record<string, unknown>) => fetchApi('/farms', { method: 'POST', body: JSON.stringify(data) }),
    delete: (farmId: string) => fetchApi(`/farms/${farmId}`, { method: 'DELETE' }),
  },
  advisories: {
    getAll: () => fetchApi('/advisories'),
    generateAI: (prompt: string) => fetchApi('/advisories/ai', { method: 'POST', body: JSON.stringify({ prompt }) }),
  },
  pestDetection: {
    detect: (imageUrl: string) => fetchApi('/pest-detection/detect', { method: 'POST', body: JSON.stringify({ imageUrl }) }),
    getHistory: () => fetchApi('/pest-detection/history'),
  },
  chatbot: {
    send: (message: string) => fetchApi('/chatbot', { method: 'POST', body: JSON.stringify({ message }) }),
    getHistory: () => fetchApi('/chatbot/history'),
  },
  notifications: {
    getAll: () => fetchApi('/notifications'),
    getUnreadCount: () => fetchApi('/notifications/unread-count'),
  },
  cropJourney: {
    create: (data: Record<string, unknown>) => fetchApi('/crop-journeys', { method: 'POST', body: JSON.stringify(data) }),
    list: () => fetchApi('/crop-journeys'),
    get: (id: string) => fetchApi(`/crop-journeys/${id}`),
    updateProgress: (id: string, payload: Record<string, unknown>) => fetchApi(`/crop-journeys/${id}/progress`, { method: 'PATCH', body: JSON.stringify(payload) }),
    addIrrigation: (id: string, payload: Record<string, unknown>) => fetchApi(`/crop-journeys/${id}/irrigation`, { method: 'POST', body: JSON.stringify(payload) }),
    addHealth: (id: string, payload: Record<string, unknown>) => fetchApi(`/crop-journeys/${id}/health`, { method: 'POST', body: JSON.stringify(payload) }),
    timeline: (id: string) => fetchApi(`/crop-journeys/${id}/timeline`),
  },
};

export default api;
