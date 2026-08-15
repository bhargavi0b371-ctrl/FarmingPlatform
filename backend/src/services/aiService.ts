import { config } from '../config/index.js';

export interface AiInsightInput {
  weatherSummary: string;
  cropType: string;
  growthStage: string;
  marketSummary: string;
}

export class AiService {
  private get geminiKey(): string {
    return config.ai.geminiKey;
  }

  async generateAgricultureInsight(input: AiInsightInput): Promise<string> {
    if (!this.geminiKey) {
      throw new Error('AI key is not configured. Set GEMINI_API_KEY or GOOGLE_AI_STUDIO_API_KEY.');
    }

    const prompt = `You are an agricultural advisory assistant for Indian farmers. Using the following details, provide a concise action plan with weather, irrigation, and market advice.\n\nWeather: ${input.weatherSummary}\nCrop: ${input.cropType}\nGrowth stage: ${input.growthStage}\nMarket: ${input.marketSummary}\n\nResponse format:\n- Short recommendation line\n- Specific irrigation advice\n- Market timing or harvest window suggestion`;

    const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': this.geminiKey,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        systemInstruction: {
          parts: [{ text: 'You are a helpful agricultural advisor for Indian farmers.' }],
        },
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 220,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API request failed: ${errorText}`);
    }

    const payload = await response.json();
    const content = payload?.candidates?.[0]?.content?.parts?.[0]?.text?.trim();
    return content || 'No insight available.';
  }
}

export default new AiService();
