import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../exceptions';

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  // Handle Zod schema errors (Data Quality Management)
  if (err instanceof ZodError) {
    return res.status(400).json({
      success: false,
      errorType: 'DATA_QUALITY_MANAGEMENT_ERROR',
      message: 'Data Quality Validation Failed: Input schema rules violated.',
      validationIssues: err.errors.map(e => ({
        field: e.path.join('.'),
        rule: e.code,
        message: e.message
      }))
    });
  }

  // Handle known application errors (Governance, RBAC, etc.)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      errorType: err.name,
      message: err.message,
      details: err.details || null
    });
  }

  console.error('Unhandled Server Error:', err);
  return res.status(500).json({
    success: false,
    errorType: 'INTERNAL_SERVER_ERROR',
    message: err.message || 'An unexpected internal error occurred.'
  });
}
