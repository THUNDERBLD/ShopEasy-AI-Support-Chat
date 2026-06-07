// Server/src/services/llm/geminiProvider.ts

import { GoogleGenerativeAI } from '@google/generative-ai';
import { GEMINI_API_KEY } from '../../config/constants.js';
import type { ChatMessage } from './llmService.js';

let client: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!client) {
    console.log('[Gemini] Initializing client with key length:', GEMINI_API_KEY?.length || 0);
    client = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
  return client;
}

export async function generateWithGemini(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  console.log('[Gemini] Generating response...');
  const model = getClient().getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: systemPrompt,
  });

  // Gemini uses "user" and "model" roles
  const formattedHistory = history.map((msg) => ({
    role: msg.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: msg.content }],
  }));

  const chat = model.startChat({
    history: formattedHistory,
  });

  console.log('[Gemini] Sending message to API...');
  const result = await chat.sendMessage(userMessage);
  const text = result.response.text();

  if (!text) throw new Error('Gemini returned empty response');

  return text.trim();
}