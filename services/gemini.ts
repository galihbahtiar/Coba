
import { GoogleGenAI, Type } from "@google/genai";
import { RecordType } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseAmplopText = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Parse input teks ini menjadi data amplop terstruktur: "${text}". 
    Jika tidak ada tanggal, gunakan hari ini (${new Date().toISOString().split('T')[0]}). 
    Ekstrak juga informasi alamat (address) dan waktu pengingat (reminderTime dalam format HH:mm) jika disebutkan.
    Kategorikan acara jika tidak disebutkan secara eksplisit.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          type: { type: Type.STRING, description: "INCOME atau EXPENSE" },
          date: { type: Type.STRING, description: "YYYY-MM-DD format" },
          amount: { type: Type.NUMBER },
          name: { type: Type.STRING },
          contact: { type: Type.STRING },
          address: { type: Type.STRING },
          event: { type: Type.STRING },
          category: { type: Type.STRING },
          reminder: { type: Type.BOOLEAN },
          reminderTime: { type: Type.STRING, description: "HH:mm format" }
        },
        required: ["type", "amount", "name", "event"]
      }
    }
  });

  try {
    return JSON.parse(response.text.trim());
  } catch (e) {
    console.error("AI parse error", e);
    return null;
  }
};
