import { supabase } from "../config/supabase.js";
import { ChatMessage, Language } from "../types/index.js";
import { generateUUID } from "../utils/helpers.js";
import { config } from "../config/index.js";

const translations: Record<Language, Record<string, string>> = {
  en: { greeting: "Hello! How can I help you?", pest_inquiry: "Please describe the symptoms or upload an image.", default: "I can help with crops, pests, weather, and market prices." },
  ta: { greeting: "???????!", pest_inquiry: "?????????? ????????????.", default: "?????, ??????, ?????? ??????? ????? ????????? ??? ????????." },
  hi: { greeting: "??????!", pest_inquiry: "??????? ?? ????? ?????", default: "??? ???, ???, ???? ?? ????? ?? ?????? ??? ??? ?? ???? ????" },
  te: { greeting: "????????!", pest_inquiry: "????????? ??????????.", default: "???, ??????, ??????? ????? ???????? ????? ????? ???????." },
};

export class ChatbotService {
  async processMessage(userId: string, message: string, language: Language = "en", sessionId?: string): Promise<ChatMessage> {
    const intent = this.detectIntent(message);
    const response = await this.generateResponse(message, intent, language);

    const userMsg: ChatMessage = {
      id: generateUUID(),
      user_id: userId,
      session_id: sessionId || generateUUID(),
      message_type: "user",
      message,
      language,
      entities: {},
      created_at: new Date(),
    };
    await this.saveMessage(userMsg);

    const assistantMsg: ChatMessage = {
      id: generateUUID(),
      user_id: userId,
      session_id: userMsg.session_id,
      message_type: "assistant",
      message: response,
      language,
      entities: {},
      created_at: new Date(),
    };
    await this.saveMessage(assistantMsg);
    return assistantMsg;
  }

  private detectIntent(message: string): string {
    const m = message.toLowerCase();
    if (m.match(/hello|hi|namaste/)) return "greeting";
    if (m.match(/pest|insect|disease|bug/)) return "pest_inquiry";
    if (m.match(/crop|plant|grow/)) return "crop_inquiry";
    if (m.match(/weather|rain|temperature/)) return "weather_inquiry";
    if (m.match(/price|market|mandi/)) return "market_inquiry";
    return "general";
  }

  private async generateResponse(message: string, intent: string, language: Language): Promise<string> {
    const base = translations[language][intent as keyof typeof translations[Language]] || translations[language].default;

    if (config.ai.geminiKey) {
      try {
        const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent", {
          method: "POST",
          headers: { "Content-Type": "application/json", "x-goog-api-key": config.ai.geminiKey },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: message }],
              },
            ],
            generationConfig: {
              maxOutputTokens: 150,
            },
          }),
        });
        const data = await response.json() as { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
        return data.candidates?.[0]?.content?.parts?.[0]?.text || base;
      } catch {}
    }
    return base;
  }

  private async saveMessage(msg: ChatMessage): Promise<void> {
    await supabase.from("chat_history").insert({
      id: msg.id,
      user_id: msg.user_id,
      session_id: msg.session_id,
      message_type: msg.message_type,
      message: msg.message,
      language: msg.language,
    });
  }

  async getChatHistory(userId: string): Promise<ChatMessage[]> {
    const { data } = await supabase.from("chat_history").select("*").eq("user_id", userId).order("created_at", { ascending: true });
    return (data || []) as ChatMessage[];
  }
}

export default new ChatbotService();
