// src/middlewares/validateAuth.ts
import { Request, Response, NextFunction } from 'express';
import { check, validationResult, ValidationError, Result } from 'express-validator';

type FieldValidationError = ValidationError & { param: string };

export const validateAuthCode = [
  check('code')
    .exists().withMessage('Authorization code is required')
    .isString().withMessage('Authorization code must be a string')
    .notEmpty().withMessage('Authorization code cannot be empty'),

  (req: Request, res: Response, next: NextFunction): void => {
    const errors: Result<ValidationError> = validationResult(req);

    if (!errors.isEmpty()) {
      res.status(400).json({
        error: 'Validation failed',
        details: errors.array().map((err) => {
          const e = err as FieldValidationError;
          return {
            field: e.param,
            message: e.msg
          };
        })
      });
      return;
    }

    next();
  }
];
