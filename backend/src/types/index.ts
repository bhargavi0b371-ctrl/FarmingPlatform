export type UserRole = 'farmer' | 'expert' | 'admin';
export type Language = 'en' | 'ta' | 'hi' | 'te';
export type SoilType = 'clay' | 'sandy' | 'loamy' | 'silt' | 'peat' | 'chalk' | 'alluvial' | 'black' | 'red' | 'laterite';
export type IrrigationType = 'drip' | 'sprinkler' | 'surface' | 'rainfed';
export type WaterSource = 'well' | 'canal' | 'river' | 'pond' | 'rainwater';
export type CropStage = 'sowing' | 'germination' | 'vegetative' | 'flowering' | 'fruiting' | 'maturity' | 'harvest';
export type CropStatus = 'active' | 'harvested' | 'failed' | 'planned';
export type DetectionType = 'pest' | 'disease' | 'nutrient_deficiency';
export type Severity = 'low' | 'medium' | 'high' | 'critical';
export type AdvisoryType = 'crop_recommendation' | 'fertilizer' | 'irrigation' | 'pest_alert' | 'weather_alert' | 'harvest' | 'general';
export type Priority = 'low' | 'normal' | 'high' | 'urgent';
export type NotificationType = 'advisory' | 'alert' | 'weather' | 'market' | 'pest' | 'system';
export type FeedbackType = 'advisory_rating' | 'bug_report' | 'feature_request' | 'general';
export type MessageType = 'user' | 'assistant';

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  role: UserRole;
  language: Language;
  profile_image?: string;
  is_active: boolean;
  is_verified: boolean;
  last_login?: Date;
  preferences: Record<string, unknown>;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date;
}

export interface Farm {
  id: string;
  user_id: string;
  name: string;
  location_address?: string;
  latitude?: number;
  longitude?: number;
  land_size_hectares: number;
  soil_type?: SoilType;
  irrigation_type?: IrrigationType;
  water_source?: WaterSource;
  state?: string;
  district?: string;
  village?: string;
  pincode?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface Crop {
  id: string;
  farm_id: string;
  name: string;
  variety?: string;
  planting_date?: Date;
  expected_harvest_date?: Date;
  area_hectares?: number;
  current_stage?: CropStage;
  status: CropStatus;
  yield_kg?: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface SoilReport {
  id: string;
  farm_id: string;
  report_date: Date;
  ph_level?: number;
  nitrogen_level?: number;
  phosphorus_level?: number;
  potassium_level?: number;
  organic_carbon?: number;
  ec_level?: number;
  micronutrients: Record<string, unknown>;
  recommendations?: string[];
  lab_name?: string;
  report_file?: string;
  created_at: Date;
}

export interface PestDetection {
  id: string;
  user_id: string;
  farm_id?: string;
  crop_id?: string;
  image_url: string;
  detection_type: DetectionType;
  detected_name: string;
  confidence_score: number;
  symptoms: string[];
  organic_treatment: string[];
  chemical_treatment: string[];
  prevention_methods: string[];
  severity?: Severity;
  is_resolved: boolean;
  resolved_at?: Date;
  notes?: string;
  created_at: Date;
}

export interface Advisory {
  id: string;
  user_id: string;
  farm_id?: string;
  crop_id?: string;
  advisory_type: AdvisoryType;
  title: string;
  content: string;
  priority: Priority;
  is_read: boolean;
  read_at?: Date;
  action_taken: boolean;
  valid_from: Date;
  valid_until?: Date;
  metadata: Record<string, unknown>;
  created_at: Date;
}

export interface MarketPrice {
  id: string;
  crop_name: string;
  mandi_name: string;
  state: string;
  district?: string;
  min_price: number;
  max_price: number;
  modal_price: number;
  unit: string;
  price_date: Date;
  arrival_qty?: number;
  created_at: Date;
}

export interface WeatherLog {
  id: string;
  farm_id?: string;
  latitude: number;
  longitude: number;
  temperature_c?: number;
  temperature_min_c?: number;
  temperature_max_c?: number;
  humidity_percent?: number;
  wind_speed_kmh?: number;
  wind_direction?: number;
  rainfall_mm?: number;
  pressure_hpa?: number;
  visibility_km?: number;
  cloud_cover_percent?: number;
  weather_condition?: string;
  weather_icon?: string;
  sunrise_time?: string;
  sunset_time?: string;
  forecast_date: Date;
  created_at: Date;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  notification_type: NotificationType;
  priority: Priority;
  is_read: boolean;
  read_at?: Date;
  action_url?: string;
  metadata: Record<string, unknown>;
  sent_at: Date;
  created_at: Date;
}

export interface Feedback {
  id: string;
  user_id: string;
  advisory_id?: string;
  feedback_type: FeedbackType;
  rating?: number;
  comment?: string;
  is_resolved: boolean;
  resolved_at?: Date;
  resolved_by?: string;
  created_at: Date;
}

export interface ChatMessage {
  id: string;
  user_id: string;
  session_id: string;
  message_type: MessageType;
  message: string;
  voice_input_url?: string;
  voice_output_url?: string;
  language: Language;
  intent_detected?: string;
  entities: Record<string, unknown>;
  created_at: Date;
}

export interface JwtPayload {
  userId: string;
  phone: string;
  role: UserRole;
  iat: number;
  exp: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
