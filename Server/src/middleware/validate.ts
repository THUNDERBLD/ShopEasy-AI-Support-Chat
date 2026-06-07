// Server/src/middleware/validate.ts

import type { Request, Response, NextFunction } from 'express';
import { MAX_MESSAGE_LENGTH } from '../config/constants.js';

export function validateChatMessage(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const { message } = req.body as { message?: unknown };

  if (message === undefined || message === null || String(message).trim() === '') {
    res.status(400).json({ error: 'Message cannot be empty.' });
    return;
  }

  if (typeof message !== 'string') {
    res.status(400).json({ error: 'Message must be a string.' });
    return;
  }

  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    res.status(400).json({
      error: `Message is too long. Maximum allowed length is ${MAX_MESSAGE_LENGTH} characters.`,
    });
    return;
  }

  next();
}