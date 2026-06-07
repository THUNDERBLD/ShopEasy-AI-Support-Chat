// Server/src/config/constants.ts

import dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3001;

export const LLM_PROVIDER = (process.env.LLM_PROVIDER ?? 'gemini') as 'gemini' | 'openai' | 'claude' | 'cohere';

export const GEMINI_API_KEY = process.env.GEMINI_API_KEY ?? '';
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY ?? '';
export const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY ?? '';
export const COHERE_API_KEY = process.env.COHERE_API_KEY ?? '';
export const COHERE_MODEL = process.env.COHERE_MODEL ?? 'command-a-03-2025';
export const CLIENT_ORIGINS = (process.env.CLIENT_ORIGINS ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

export const MAX_MESSAGE_LENGTH = process.env.MAX_MESSAGE_LENGTH
  ? parseInt(process.env.MAX_MESSAGE_LENGTH)
  : 5000;

export const MAX_HISTORY_MESSAGES = process.env.MAX_HISTORY_MESSAGES
  ? parseInt(process.env.MAX_HISTORY_MESSAGES)
  : 10;

// Validate that the required API key exists for the chosen provider
export function validateEnv(): void {
  const providerKeyMap: Record<string, string> = {
    gemini: GEMINI_API_KEY,
    openai: OPENAI_API_KEY,
    claude: ANTHROPIC_API_KEY,
    cohere: COHERE_API_KEY,
  };

  const key = providerKeyMap[LLM_PROVIDER];

  if (!key) {
    console.error(
      `❌ Missing API key for provider "${LLM_PROVIDER}". ` +
      `Set the corresponding key in your .env file.`
    );
    process.exit(1);
  }

  console.log(`✅ LLM Provider: ${LLM_PROVIDER}`);
}
