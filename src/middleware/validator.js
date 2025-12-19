const { body, validationResult } = require('express-validator');

exports.validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map(validation => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }

    res.status(400).json({
      success: false,
      errors: errors.array()
    });
  };
};

// Validation rules
exports.registerRules = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['Admin', 'Technician', 'Staff']).withMessage('Invalid role')
];

exports.loginRules = [
  body('email').isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required')
];

exports.workOrderRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').isIn(['HVAC', 'Electrical', 'Plumbing', 'Fire Safety']).withMessage('Invalid category'),
  body('priority').isIn(['Emergency', 'High', 'Medium', 'Low']).withMessage('Invalid priority'),
  body('location').trim().notEmpty().withMessage('Location is required')
];

exports.pmScheduleRules = [
  body('title').trim().notEmpty().withMessage('Title is required'),
  body('asset').trim().notEmpty().withMessage('Asset is required'),
  body('frequency').isIn(['Daily', 'Weekly', 'Monthly', 'Quarterly', 'Annually']).withMessage('Invalid frequency'),
  body('nextDueDate').isISO8601().withMessage('Invalid date format')
];