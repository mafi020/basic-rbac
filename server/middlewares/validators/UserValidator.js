const { body, validationResult } = require('express-validator');

exports.createUserValidator = [
  body('name').not().isEmpty().withMessage('Name is required'),
  body('role').not().isEmpty().withMessage('Role is required'),
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid email address')
    .bail(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is requried')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail()
    .custom((val, { req }) => {
      if (val !== req.body.confirmPassword) {
        throw new Error("Passwords don't match");
      } else {
        return val;
      }
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors);
    next();
  },
];
exports.loginValidator = [
  body('email')
    .not()
    .isEmpty()
    .withMessage('Email is required')
    .bail()
    .isEmail()
    .withMessage('Email must be valid email address')
    .bail(),
  body('password')
    .not()
    .isEmpty()
    .withMessage('Password is requried')
    .bail()
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(422).json(errors);
    next();
  },
];
