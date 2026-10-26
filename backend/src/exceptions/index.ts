export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: any;

  constructor(message: string, statusCode = 500, details?: any) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export class BadRequestError extends AppError {
  constructor(message = 'Bad Request', details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication Required') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Data Governance Violation: Access Denied. Insufficient role permissions.') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Resource Not Found') {
    super(message, 404);
  }
}

export class DataQualityError extends AppError {
  constructor(message = 'Data Quality Management (DQM) Validation Failure', details?: any) {
    super(message, 422, details);
  }
}
