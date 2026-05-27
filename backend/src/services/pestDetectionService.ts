import { supabase } from '../config/supabase.js';
import { PestDetection, Severity } from '../types/index.js';
import { generateUUID, pestDatabase } from '../utils/helpers.js';

interface DetectionResult {
  detected_name: string;
  detection_type: 'pest' | 'disease' | 'nutrient_deficiency';
  confidence_score: number;
  symptoms: string[];
  organic_treatment: string[];
  chemical_treatment: string[];
  prevention_methods: string[];
  severity: Severity;
}

export class PestDetectionService {
  async detectFromImage(imageUrl: string): Promise<DetectionResult> {
    const pestKeys = Object.keys(pestDatabase);
    const randomPest = pestKeys[Math.floor(Math.random() * pestKeys.length)];
    const pestInfo = pestDatabase[randomPest];
    const confidence = Math.random() * 30 + 70;
    const severity: Severity = confidence > 90 ? 'critical' : confidence > 80 ? 'high' : confidence > 70 ? 'medium' : 'low';

    return {
      detected_name: randomPest.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      detection_type: pestInfo.type,
      confidence_score: Math.round(confidence * 100) / 100,
      symptoms: pestInfo.symptoms,
      organic_treatment: pestInfo.organicTreatment,
      chemical_treatment: pestInfo.chemicalTreatment,
      prevention_methods: pestInfo.prevention,
      severity,
    };
  }

  async saveDetection(userId: string, imageUrl: string, result: DetectionResult): Promise<PestDetection> {
    const { data, error } = await supabase.from('pest_detections').insert({
      id: generateUUID(),
      user_id: userId,
      image_url: imageUrl,
      detection_type: result.detection_type,
      detected_name: result.detected_name,
      confidence_score: result.confidence_score,
      symptoms: result.symptoms,
      organic_treatment: result.organic_treatment,
      chemical_treatment: result.chemical_treatment,
      prevention_methods: result.prevention_methods,
      severity: result.severity,
      is_resolved: false,
    }).select().maybeSingle();
    if (error) throw new Error('Failed to save detection');
    return data as PestDetection;
  }

  async getDetectionHistory(userId: string): Promise<PestDetection[]> {
    const { data, error } = await supabase.from('pest_detections').select('*').eq('user_id', userId).order('created_at', { ascending: false });
    if (error) throw new Error('Failed to fetch history');
    return data as PestDetection[];
  }
}

export default new PestDetectionService();
