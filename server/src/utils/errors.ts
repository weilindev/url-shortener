/**
 * Custom error class following KISS principle
 */

export class CustomError extends Error {
  statusCode: number;

  constructor(message: string = 'Internal Server Error', statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'CustomError';
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Convenient factory methods for common HTTP errors
 */
export const createError = {
  badRequest: (message = 'Bad Request') => new CustomError(message, 400),
  notFound: (message = 'Resource not found') => new CustomError(message, 404),
  conflict: (message = 'Conflict') => new CustomError(message, 409),
  gone: (message = 'Resource is no longer available') => new CustomError(message, 410),
  internal: (message = 'Internal Server Error') => new CustomError(message, 500),
};
