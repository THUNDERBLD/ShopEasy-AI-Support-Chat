// Server/src/services/llm/claudeProvider.ts

import Anthropic from '@anthropic-ai/sdk';
import { ANTHROPIC_API_KEY } from '../../config/constants.js';
import type { ChatMessage } from './llmService.js';

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }
  return client;
}

export async function generateWithClaude(
  systemPrompt: string,
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  const messages: Anthropic.MessageParam[] = [
    ...history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    })),
    { role: 'user', content: userMessage },
  ];

  const response = await getClient().messages.create({
    model: 'claude-haiku-4-5',
    max_tokens: 500,
    system: systemPrompt,
    messages,
  });

  const block = response.content[0];
  if (!block || block.type !== 'text') throw new Error('Claude returned empty response');

  return block.text.trim();
}