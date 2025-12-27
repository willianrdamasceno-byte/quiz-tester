
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types.ts";

// Função para obter a API Key de forma segura
const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (config: QuizConfig): Promise<Question[]> => {
  const ai = getAI();
  const prompt = `System: Você é um Terminal de IA Hacker. 
  Gere um quiz técnico sobre "${config.topic}".
  Nível: ${config.difficulty}.
  Quantidade: ${config.count}.
  Regras: 
  - Retorne APENAS o JSON.
  - Se o tema não for TI, use "Curiosidades sobre Computação".
  - Inclua explicações curtas e sarcásticas no campo 'explanation'.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              question: { type: Type.STRING },
              options: { type: Type.ARRAY, items: { type: Type.STRING } },
              correctAnswer: { type: Type.STRING },
              explanation: { type: Type.STRING }
            },
            required: ["question", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const data = JSON.parse(response.text);
    return data.map((q: any, i: number) => ({ ...q, id: `q-${i}` }));
  } catch (err) {
    console.error("Critical Uplink Failure:", err);
    throw err;
  }
};

export const getAIResultFeedback = async (score: number, total: number, topic: string): Promise<string> => {
  const ai = getAI();
  const prompt = `Analise o desempenho: ${score}/${total} no tópico ${topic}. Responda como um Hacker que acabou de invadir um sistema, em 1 frase curta.`;
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt
    });
    return response.text;
  } catch {
    return "Métricas de desempenho corrompidas.";
  }
};
