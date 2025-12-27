
import { GoogleGenAI, Type } from "@google/genai";
import { Question, QuizConfig } from "../types.ts";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateQuiz = async (config: QuizConfig): Promise<Question[]> => {
  const prompt = `Você é um Terminal de Segurança Cibernética avançado. 
  Gere um quiz técnico sobre "${config.topic}" (dentro do domínio de TI/Informática).
  Dificuldade: ${config.difficulty}.
  Quantidade: ${config.count} perguntas.
  
  REGRAS CRÍTICAS:
  1. O tema DEVE ser relacionado a informática (Hardware, Redes, Programação, SO, Segurança, IA).
  2. Se o tema solicitado não for de informática, force o tema para "Conceitos Fundamentais de TI".
  3. Responda APENAS em JSON seguindo o esquema.`;

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
            options: { 
              type: Type.ARRAY, 
              items: { type: Type.STRING } 
            },
            correctAnswer: { type: Type.STRING },
            explanation: { type: Type.STRING }
          },
          required: ["question", "options", "correctAnswer", "explanation"]
        }
      }
    }
  });

  const rawData = JSON.parse(response.text);
  return rawData.map((q: any, index: number) => ({
    ...q,
    id: `q-${index}`
  }));
};

export const getAIResultFeedback = async (score: number, total: number, topic: string): Promise<string> => {
  const prompt = `Persona: Operador de Matrix/Hacker experiente.
  Status do usuário: Acertou ${score} de ${total} no teste de "${topic}".
  Dê um diagnóstico técnico curto, usando gírias de hacker/TI (ex: bug, root, bypass, kernel, overclock). 
  Idioma: Português-BR.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text || "Acesso negado às métricas de desempenho.";
};
