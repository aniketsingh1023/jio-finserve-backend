/**
 * Error handling utilities
 * Standardized error responses
 */

export class AppError extends Error {
  status: number;
  errors?: Array<{ field: string; message: string }>;

  constructor(message: string, status: number = 500, errors?: Array<{ field: string; message: string }>) {
    super(message);
    this.status = status;
    this.errors = errors;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const handleError = (err: any, res: any) => {
  console.error('Error Details:', {
    name: err.name,
    message: err.message,
    code: err.code,
    meta: err.meta,
  });

  // Validation errors
  if (err instanceof AppError && err.errors) {
    return res.status(err.status).json({
      error: err.message,
      validationErrors: err.errors,
    });
  }

  // Prisma unique constraint errors (P2002 - Unique constraint failed)
  if (err.code === 'P2002') {
    const field = err.meta?.target?.[0] || 'field';
    const fieldName = field.charAt(0).toUpperCase() + field.slice(1);
    return res.status(409).json({
      error: `${fieldName} is already in use`,
    });
  }

  // Prisma record not found (P2025)
  if (err.code === 'P2025') {
    return res.status(404).json({
      error: 'Record not found',
    });
  }

  // Prisma connection errors
  if (err.code === 'P1000' || err.code === 'P1001' || err.code === 'P1002') {
    return res.status(503).json({
      error: 'Database connection error. Please try again later.',
    });
  }

  // AppError
  if (err instanceof AppError) {
    return res.status(err.status).json({ error: err.message });
  }

  // Generic error
  console.error('Unexpected error:', err);
  return res.status(500).json({ error: 'Internal server error' });
};
