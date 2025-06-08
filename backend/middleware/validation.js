import Joi from 'joi';

/**
 * Phone number validation schema
 */
const phoneSchema = Joi.string()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    'string.pattern.base': 'Phone number must be exactly 10 digits',
    'any.required': 'Phone number is required'
  });

/**
 * Email validation schema
 */
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    'string.email': 'Please provide a valid email address',
    'any.required': 'Email address is required'
  });

/**
 * Date validation schema
 */
const dateSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    'string.pattern.base': 'Date must be in YYYY-MM-DD format',
    'any.required': 'Date is required'
  });

/**
 * Booking validation schema
 */
const bookingSchema = Joi.object({
  date: dateSchema,
  time: Joi.string()
    .pattern(/^(1[0-2]|[1-9]):[0-5][0-9] (AM|PM)$/)
    .required()
    .messages({
      'string.pattern.base': 'Time must be in format "H:MM AM/PM"',
      'any.required': 'Time is required'
    }),
  clientName: Joi.string()
    .trim()
    .min(2)
    .max(100)
    .required()
    .messages({
      'string.min': 'Name must be at least 2 characters long',
      'string.max': 'Name cannot exceed 100 characters',
      'any.required': 'Client name is required'
    }),
  clientPhone: phoneSchema,
  clientEmail: emailSchema,
  sessionType: Joi.string()
    .valid('in-person', 'video', 'phone')
    .required()
    .messages({
      'any.only': 'Session type must be one of: in-person, video, phone',
      'any.required': 'Session type is required'
    }),
  notes: Joi.string()
    .max(500)
    .allow('')
    .optional()
    .messages({
      'string.max': 'Notes cannot exceed 500 characters'
    })
});

/**
 * Email data validation schema
 */
const emailDataSchema = Joi.object({
  clientName: Joi.string().required(),
  clientEmail: emailSchema,
  clientPhone: Joi.string().required(),
  appointmentDate: Joi.string().required(),
  appointmentTime: Joi.string().required(),
  sessionType: Joi.string().valid('in-person', 'video', 'phone').required(),
  notes: Joi.string().allow('').optional(),
  bookingId: Joi.string().required()
});

/**
 * Validate booking data middleware
 */
export const validateBooking = (req, res, next) => {
  const { error, value } = bookingSchema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors
    });
  }
  
  // Additional business logic validation
  const appointmentDate = new Date(value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (appointmentDate < today) {
    return res.status(400).json({
      success: false,
      message: 'Cannot book appointments for past dates'
    });
  }
  
  // Check if it's a weekend
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return res.status(400).json({
      success: false,
      message: 'Appointments are not available on weekends'
    });
  }
  
  req.body = value;
  next();
};

/**
 * Validate date query parameter
 */
export const validateDateQuery = (req, res, next) => {
  const { error } = dateSchema.validate(req.params.date);
  
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid date format. Use YYYY-MM-DD'
    });
  }
  
  next();
};

/**
 * Validate email data middleware
 */
export const validateEmailData = (req, res, next) => {
  const { error, value } = emailDataSchema.validate(req.body, { 
    abortEarly: false,
    stripUnknown: true 
  });
  
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path.join('.'),
      message: detail.message
    }));
    
    return res.status(400).json({
      success: false,
      message: 'Email data validation failed',
      errors
    });
  }
  
  req.body = value;
  next();
};

/**
 * Sanitize phone number (remove formatting)
 */
export const sanitizePhoneNumber = (phone) => {
  return phone.replace(/\D/g, '');
};

/**
 * Validate and sanitize phone number
 */
export const validatePhoneNumber = (phone) => {
  const sanitized = sanitizePhoneNumber(phone);
  const { error } = phoneSchema.validate(sanitized);
  
  return {
    isValid: !error,
    sanitized,
    error: error ? error.details[0].message : null
  };
};

/**
 * Validate email format
 */
export const validateEmailFormat = (email) => {
  const { error } = emailSchema.validate(email);
  
  return {
    isValid: !error,
    error: error ? error.details[0].message : null
  };
};