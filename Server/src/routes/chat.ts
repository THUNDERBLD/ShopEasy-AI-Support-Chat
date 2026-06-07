// Server/src/routes/chat.ts

import { Router } from 'express';
import type { NextFunction, Request, Response } from 'express';
import {
  createConversation,
  conversationExists,
  saveMessage,
  getRecentMessages,
  getFullHistory,
} from '../services/chatService.js';
import { generateReply } from '../services/llm/llmService.js';
import type { ChatMessage } from '../services/llm/llmService.js';
import { validateChatMessage } from '../middleware/validate.js';

const router = Router();

// POST /chat/message
router.post(
  '/message',
  validateChatMessage,
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { message, sessionId } = req.body as {
        message: string;
        sessionId?: string;
      };

      // Resolve or create session
      let conversationId: string;

      if (sessionId && conversationExists(sessionId)) {
        conversationId = sessionId;
      } else {
        conversationId = createConversation();
      }

      // Persist user message
      saveMessage(conversationId, 'user', message.trim());

      // Fetch recent history for LLM context (excludes the message we just saved)
      const recentMessages = getRecentMessages(conversationId);

      // Format history for LLM (exclude the last message — that's the current userMessage)
      const history: ChatMessage[] = recentMessages
        .slice(0, -1) // all except the user message we just added
        .map((msg) => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text,
        }));

      // Generate AI reply
      let reply: string;
      try {
        reply = await generateReply(history, message.trim());
      } catch {
        res.status(503).json({
          error: 'Unable to connect to the AI provider. Please try again later.',
        });
        return;
      }

      // Persist AI reply
      saveMessage(conversationId, 'ai', reply);

      res.status(200).json({
        reply,
        sessionId: conversationId,
      });
    } catch (error) {
      console.error('[Chat Route Error]', error);
      next(error);
    }
  }
);

// GET /chat/history/:sessionId
router.get(
  '/history/:sessionId',
  (req: Request, res: Response): void => {
    const sessionId = req.params.sessionId as string;

    if (!sessionId || !conversationExists(sessionId)) {
      res.status(404).json({ error: 'Session not found.' });
      return;
    }

    const messages = getFullHistory(sessionId);

    res.status(200).json({ messages });
  }
);

export default router;
