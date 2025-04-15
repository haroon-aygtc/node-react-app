import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import { ValidationError } from '../utils/errors.js';

/**
 * Middleware to validate request data using express-validator
 * @param validations Array of validation chains from express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, _res: Response, next: NextFunction) => {
    try {
      // Run all validations
      await Promise.all(validations.map(validation => validation.run(req)));

      // Check for validation errors
      const errors = validationResult(req);
      if (errors.isEmpty()) {
        return next();
      }

      // Format errors for consistent response
      const formattedErrors: Record<string, string[]> = {};

      // Use the mapped() method to get a more structured error object
      const errorMap = errors.mapped();

      // Process each error
      Object.entries(errorMap).forEach(([field, error]) => {
        if (!formattedErrors[field]) {
          formattedErrors[field] = [];
        }

        // Extract the error message
        const message = typeof error.msg === 'string'
          ? error.msg
          : 'Validation error';

        formattedErrors[field].push(message);
      });

      // If no errors were formatted (rare case), add a general error
      if (Object.keys(formattedErrors).length === 0) {
        formattedErrors['general'] = ['Validation failed'];
      }

      // Throw validation error to be caught by error handler
      next(new ValidationError('Validation failed', formattedErrors));
    } catch (error) {
      // Handle any unexpected errors in the validation process
      console.error('Validation middleware error:', error);
      next(error);
    }
  };
};
