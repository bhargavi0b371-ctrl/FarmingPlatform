export type UserRole = 'farmer' | 'expert' | 'admin';

export interface User {
  id: string;
  phone: string;
  name: string;
  role: UserRole;
  language: string;
}

export interface Farm {
  id: string;
  name: string;
  land_size_hectares: number;
  soil_type?: string;
  state?: string;
}

export interface WeatherData {
  temperature_c?: number;
  humidity_percent?: number;
  weather_condition?: string;
}

export interface MarketPrice {
  crop_name: string;
  mandi_name: string;
  modal_price: number;
  unit: string;
}
