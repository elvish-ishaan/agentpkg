import { Request, Response, NextFunction } from 'express';
import { ApiError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { ZodError } from 'zod';

/**
 * Global error handler middleware
 */
export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction) {
  // Log error
  logger.error({
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack,
    },
    request: {
      method: req.method,
      url: req.url,
      body: req.body,
      params: req.params,
      query: req.query,
      user: req.user?.id,
    },
  }, 'Request error');

  // Handle ApiError
  if (err instanceof ApiError) {
    const response: any = {
      error: {
        code: err.code || 'API_ERROR',
        message: err.message,
      },
    };

    // Add validation errors if present
    if (err instanceof ValidationError && err.errors) {
      response.error.errors = err.errors;
    }

    return res.status(err.statusCode).json(response);
  }

  // Handle Zod validation errors
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.errors.forEach((e) => {
      const path = e.path.join('.');
      if (!errors[path]) {
        errors[path] = [];
      }
      errors[path].push(e.message);
    });

    return res.status(400).json({
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        errors,
      },
    });
  }

  // Handle Prisma errors
  if (err.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as any;

    if (prismaError.code === 'P2002') {
      return res.status(409).json({
        error: {
          code: 'CONFLICT',
          message: 'A record with this value already exists',
          field: prismaError.meta?.target?.[0],
        },
      });
    }

    if (prismaError.code === 'P2025') {
      return res.status(404).json({
        error: {
          code: 'NOT_FOUND',
          message: 'Record not found',
        },
      });
    }
  }

  // Default error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  res.status(500).json({
    error: {
      code: 'INTERNAL_SERVER_ERROR',
      message: isDevelopment ? err.message : 'An unexpected error occurred',
      ...(isDevelopment && { stack: err.stack }),
    },
  });
}

/**
 * 404 handler for undefined routes
 */
export function notFoundHandler(_req: Request, res: Response) {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Route ${_req.method} ${_req.path} not found`,
    },
  });
}
