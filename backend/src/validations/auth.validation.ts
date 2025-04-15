import { body } from 'express-validator';

export const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters long')
    .matches(/[a-zA-Z]/)
    .withMessage('Password must contain at least one letter')
    .matches(/\d/)
    .withMessage('Password must contain at least one number'),
  // Support both fullName and name fields
  body('fullName')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters long'),
  body('name')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  // Require either fullName or name
  body()
    .custom((value, { req }) => {
      if (!req.body.fullName && !req.body.name) {
        throw new Error('Either fullName or name is required');
      }
      return true;
    }),
  body('role')
    .optional({ checkFalsy: true })
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];

export const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('password')
    .notEmpty({ ignore_whitespace: true })
    .withMessage('Password is required'),
];

export const updateUserValidation = [
  body('email')
    .optional({ checkFalsy: true })
    .isEmail()
    .withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('fullName')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Full name must be at least 2 characters long'),
  body('name')
    .optional({ checkFalsy: true })
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters long'),
  body('role')
    .optional({ checkFalsy: true })
    .isIn(['user', 'admin'])
    .withMessage('Role must be either user or admin'),
];
