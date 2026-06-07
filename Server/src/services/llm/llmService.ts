// Server/src/services/llm/llmService.ts

import { LLM_PROVIDER } from '../../config/constants.js';
import { generateWithGemini } from './geminiProvider.js';
import { generateWithOpenAI } from './openaiProvider.js';
import { generateWithClaude } from './claudeProvider.js';
import { generateWithCohere } from './cohereProvider.js';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

const SYSTEM_PROMPT = `You are a helpful and professional support agent for "ShopEasy", a small e-commerce store.
Be concise, friendly, and accurate. Only answer questions related to ShopEasy.
If a question is outside your knowledge, politely say so and suggest emailing support@shopeasy.com.
Never make up information. Keep answers under 3 short paragraphs.

--- SHOPEASY STORE KNOWLEDGE ---

Shipping Policy:
- Domestic (India): 5–7 business days. Free shipping on orders above ₹999.
- International: 10–14 business days. Flat fee of ₹799.

Returns Policy:
- 30-day hassle-free returns. Items must be unused and in original packaging.
- Initiate a return via the website under "My Orders" or email support@shopeasy.com.

Refunds:
- Processed within 5–7 business days after we receive the returned item.
- Refunded to the original payment method.

Support Hours:
- Monday to Saturday, 10 AM – 6 PM IST.
- Email: support@shopeasy.com

Payment Methods:
- UPI, credit/debit cards, net banking, and Cash on Delivery (COD).

Order Tracking:
- Track your order under "My Orders" using your order ID.
- SMS and email updates are sent at each stage.

Cancellations:
- Orders can be cancelled within 2 hours of placement.
- After dispatch, cancellation is not possible — initiate a return instead.`;

export async function generateReply(
  history: ChatMessage[],
  userMessage: string
): Promise<string> {
  try {
    switch (LLM_PROVIDER) {
      case 'openai':
        return await generateWithOpenAI(SYSTEM_PROMPT, history, userMessage);
      case 'claude':
        return await generateWithClaude(SYSTEM_PROMPT, history, userMessage);
      case 'cohere':
        return await generateWithCohere(SYSTEM_PROMPT, history, userMessage);
      case 'gemini':
      default:
        return await generateWithGemini(SYSTEM_PROMPT, history, userMessage);
    }
  } catch (error) {
    console.error(`[LLM Error] Provider: ${LLM_PROVIDER}`);
    console.error('Error details:', error instanceof Error ? error.message : String(error));
    console.error('Full error:', error);
    throw error;
  }
}
