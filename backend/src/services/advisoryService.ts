import { supabase } from "../config/supabase.js";
import { Advisory, Farm, Crop, WeatherLog } from "../types/index.js";
import { generateUUID, getSeason, cropRecommendations } from "../utils/helpers.js";
import { config } from "../config/index.js";

export class AdvisoryService {
  async generateCropRecommendations(context: { farmId: string; soilType?: string }): Promise<Advisory[]> {
    const season = getSeason(new Date());
    const soilType = context.soilType || "loamy";
    const advisories: Advisory[] = [];

    for (const [cropName, req] of Object.entries(cropRecommendations)) {
      if (req.season.includes(season) && (req.soil.includes(soilType) || req.soil.length === 0)) {
        advisories.push({
          id: generateUUID(),
          user_id: "",
          farm_id: context.farmId,
          advisory_type: "crop_recommendation",
          title: `${cropName} Recommended`,
          content: `${cropName} is suitable for ${season} in ${soilType} soil.`,
          priority: "normal",
          is_read: false,
          action_taken: false,
          valid_from: new Date(),
          metadata: { crop: cropName },
          created_at: new Date(),
        });
      }
    }
    return advisories.slice(0, 5);
  }

  async getAdvisories(userId: string, filters?: { type?: string; limit?: number }): Promise<Advisory[]> {
    let query = supabase.from("advisories").select("*").eq("user_id", userId).order("created_at", { ascending: false });
    if (filters?.type) query = query.eq("advisory_type", filters.type);
    if (filters?.limit) query = query.limit(filters.limit);
    const { data, error } = await query;
    if (error) throw new Error("Failed to fetch advisories");
    return data as Advisory[];
  }

  async saveAdvisory(advisory: Advisory, userId: string): Promise<Advisory> {
    const { data, error } = await supabase.from("advisories").insert({ ...advisory, user_id: userId }).select().maybeSingle();
    if (error) throw new Error("Failed to save advisory");
    return data as Advisory;
  }

  async generateAIAdvisory(userId: string, prompt: string): Promise<string> {
    if (!config.ai.geminiKey) {
      return "Please add your farm details for personalized advice. I can help with crop recommendations, pest control, and irrigation scheduling.";
    }
    try {
      const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-goog-api-key": config.ai.geminiKey },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: prompt }],
            },
          ],
          systemInstruction: {
            parts: [{ text: "You are an expert agricultural advisor for Indian farmers." }],
          },
          generationConfig: {
            maxOutputTokens: 200,
          },
        }),
      });
      const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
      return data.candidates?.[0]?.content?.parts?.[0]?.text || "Unable to generate advice.";
    } catch {
      return "Please try again later.";
    }
  }
}

export default new AdvisoryService();
