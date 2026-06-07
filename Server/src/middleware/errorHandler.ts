// Server/src/middleware/errorHandler.ts

import type { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('[Unhandled Error]', err.message, err.stack);

  res.status(500).json({
    error: 'An unexpected error occurred. Please try again later.',
  });
}