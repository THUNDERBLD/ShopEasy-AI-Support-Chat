// Server/src/services/llm/openaiProvider.ts

import OpenAI from 'openai';
import { OPENAI_API_KEY } from '../../config/constants.js';
import type { ChatMessage } from './llmService.js';

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: OPENAI_API_KEY });
  }
  return client;
}

export async function generateWithOpenAI(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await getClient().chat.completions.create({
    model: 'gpt-4o-mini',
    messages,
    max_tokens: 500,
    temperature: 0.7,
  });

  const text = response.choices[0]?.message?.content;
  if (!text) throw new Error('OpenAI returned empty response');

  return text.trim();
}