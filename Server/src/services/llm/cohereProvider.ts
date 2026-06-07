// Server/src/services/llm/cohereProvider.ts

import { CohereClient } from 'cohere-ai';
import { COHERE_API_KEY, COHERE_MODEL } from '../../config/constants.js';
import type { ChatMessage } from './llmService.js';

let client: CohereClient | null = null;

function getClient(): CohereClient {
  if (!client) {
    console.log('[Cohere] Initializing client with key length:', COHERE_API_KEY?.length || 0);
    client = new CohereClient({ token: COHERE_API_KEY });
  }
  return client;
}

export async function generateWithCohere(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  console.log('[Cohere] Generating response...');

  // Format chat history for Cohere
  const chatHistory = history.map((msg) => ({
    role: msg.role === 'user' ? ('USER' as const) : ('CHATBOT' as const),
    message: msg.content,
  }));

  console.log('[Cohere] Sending message to API...');
  const response = await getClient().chat({
    model: COHERE_MODEL,
    chatHistory: chatHistory,
    message: userMessage,
    preamble: systemPrompt,
    maxTokens: 500,
  });

  const text = response.text;
  if (!text) throw new Error('Cohere returned empty response');

  return text.trim();
}
