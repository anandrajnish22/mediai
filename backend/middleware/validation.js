const { body, validationResult } = require('express-validator');

// Handle validation errors
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg }))
    });
  }
  next();
};

// Registration validation
const validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }),
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['patient', 'doctor', 'admin']).withMessage('Invalid role'),
  handleValidation
];

// Login validation
const validateLogin = [
  body('email').isEmail().withMessage('Please enter a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
  handleValidation
];

// Appointment validation
const validateAppointment = [
  body('doctor').notEmpty().withMessage('Doctor is required'),
  body('date').isISO8601().withMessage('Valid date is required'),
  body('timeSlot').notEmpty().withMessage('Time slot is required'),
  handleValidation
];

// Prediction validation
const validatePrediction = [
  body('type').isIn(['symptom_check', 'diabetes', 'heart_disease', 'bmi', 'stress', 'general']).withMessage('Invalid prediction type'),
  handleValidation
];

module.exports = { validateRegister, validateLogin, validateAppointment, validatePrediction, handleValidation };
