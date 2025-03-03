/**
 * Base class for API errors.
 * Extends the built-in Error class and includes an HTTP status code and optional details.
 */
export class ApiError extends Error {
  public statusCode: number;
  public details?: any;

  /**
   * Creates an instance of ApiError.
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   * @param {any} [details] - Optional additional details about the error.
   */
  constructor(message: string, statusCode: number, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error for when a requested resource is not found.
 * Returns HTTP 404 Not Found.
 */
export class NotFoundError extends ApiError {
  constructor(message = "Resource not found", details?: any) {
    super(message, 404, details);
  }
}

/**
 * Error for bad requests due to invalid input.
 * Returns HTTP 400 Bad Request.
 */
export class BadRequestError extends ApiError {
  constructor(message = "Bad request", details?: any) {
    super(message, 400, details);
  }
}

/**
 * Error for when a user has insufficient balance to proceed with a payment.
 * Returns HTTP 402 Payment Required.
 */
export class InsufficientBalanceError extends ApiError {
  constructor(message = "Insufficient balance", details?: any) {
    super(message, 402, details);
  }
}

/**
 * Error for unexpected server-side failures.
 * Returns HTTP 500 Internal Server Error.
 */
export class InternalServerError extends ApiError {
  constructor(message = "Internal Server Error", details?: any) {
    super(message, 500, details);
  }
}

/**
 * Error for when access to a resource is forbidden.
 * Returns HTTP 403 Forbidden.
 */
export class ForbiddenError extends ApiError {
  constructor(message = "Access forbidden", details?: any) {
    super(message, 403, details);
  }
}

/**
 * Error for when a user is not authenticated.
 * Returns HTTP 401 Unauthorized.
 */
export class UnauthorizedError extends ApiError {
  constructor(message = "Unauthorized", details?: any) {
    super(message, 401, details);
  }
}
