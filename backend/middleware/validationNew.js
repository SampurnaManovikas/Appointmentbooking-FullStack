import Joi from "joi";

/**
 * Phone number validation schema
 */
const phoneSchema = Joi.string()
  .pattern(/^\d{10}$/)
  .required()
  .messages({
    "string.pattern.base": "Phone number must be exactly 10 digits",
    "any.required": "Phone number is required",
  });

/**
 * Email validation schema
 */
const emailSchema = Joi.string()
  .email({ tlds: { allow: false } })
  .required()
  .messages({
    "string.email": "Please provide a valid email address",
    "any.required": "Email address is required",
  });

/**
 * Date validation schema
 */
const dateSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .required()
  .messages({
    "string.pattern.base": "Date must be in YYYY-MM-DD format",
    "any.required": "Date is required",
  });

/**
 * Registration validation schema
 */
const registerSchema = Joi.object({
  fullName: Joi.string().trim().min(2).max(50).required().messages({
    "string.min": "Full name must be at least 2 characters long",
    "string.max": "Full name cannot exceed 50 characters",
    "any.required": "Full name is required",
  }),
  email: emailSchema,
  phoneNumber: Joi.string()
    .pattern(/^\+?[1-9]\d{1,14}$/)
    .required()
    .messages({
      "string.pattern.base": "Please provide a valid phone number",
      "any.required": "Phone number is required",
    }),
  password: Joi.string().min(6).max(50).required().messages({
    "string.min": "Password must be at least 6 characters long",
    "string.max": "Password cannot exceed 50 characters",
    "any.required": "Password is required",
  }),
});

/**
 * Login validation schema
 */
const loginSchema = Joi.object({
  email: emailSchema,
  password: Joi.string().required().messages({
    "any.required": "Password is required",
  }),
});

/**
 * OTP validation schema
 */
const otpSchema = Joi.object({
  email: emailSchema,
  otp: Joi.string()
    .length(6)
    .pattern(/^\d{6}$/)
    .required()
    .messages({
      "string.length": "OTP must be exactly 6 digits",
      "string.pattern.base": "OTP must contain only digits",
      "any.required": "OTP is required",
    }),
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
      "string.pattern.base": 'Time must be in format "H:MM AM/PM"',
      "any.required": "Time is required",
    }),
  clientName: Joi.string().trim().min(2).max(100).required().messages({
    "string.min": "Name must be at least 2 characters long",
    "string.max": "Name cannot exceed 100 characters",
    "any.required": "Client name is required",
  }),
  clientPhone: phoneSchema,
  clientEmail: emailSchema,
  sessionType: Joi.string()
    .valid("in-person", "video", "phone")
    .required()
    .messages({
      "any.only": "Session type must be one of: in-person, video, phone",
      "any.required": "Session type is required",
    }),
  notes: Joi.string().max(500).allow("").optional().messages({
    "string.max": "Notes cannot exceed 500 characters",
  }),
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
  sessionType: Joi.string().valid("in-person", "video", "phone").required(),
  notes: Joi.string().allow("").optional(),
  bookingId: Joi.string().required(),
});

/**
 * Validate registration data middleware
 */
export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Validate login data middleware
 */
export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Validate OTP data middleware
 */
export const validateOTP = (req, res, next) => {
  const { error, value } = otpSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Validate booking data middleware
 */
export const validateBooking = (req, res, next) => {
  const { error, value } = bookingSchema.validate(req.body, {
    abortEarly: false,
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Additional business logic validation
  const appointmentDate = new Date(value.date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (appointmentDate < today) {
    return res.status(400).json({
      success: false,
      message: "Cannot book appointments for past dates",
    });
  }

  // Check if it's a weekend
  const dayOfWeek = appointmentDate.getDay();
  if (dayOfWeek === 0 || dayOfWeek === 6) {
    return res.status(400).json({
      success: false,
      message: "Appointments are not available on weekends",
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
      message: "Invalid date format. Use YYYY-MM-DD",
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
    stripUnknown: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      field: detail.path.join("."),
      message: detail.message,
    }));

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  req.body = value;
  next();
};

/**
 * Sanitize booking data
 */
export const sanitizeBookingData = (data) => {
  return {
    date: data.date.trim(),
    time: data.time.trim(),
    clientName: data.clientName.trim(),
    clientPhone: data.clientPhone.trim(),
    clientEmail: data.clientEmail.trim().toLowerCase(),
    sessionType: data.sessionType.trim(),
    notes: data.notes ? data.notes.trim() : "",
  };
};

/**
 * Validate form data
 */
export const validateFormData = (data) => {
  const errors = [];

  if (!data.date) errors.push("Date is required");
  if (!data.time) errors.push("Time is required");
  if (!data.clientName) errors.push("Client name is required");
  if (!data.clientPhone) errors.push("Client phone is required");
  if (!data.clientEmail) errors.push("Client email is required");
  if (!data.sessionType) errors.push("Session type is required");

  return errors;
};

/**
 * Rate limiting for email sending
 */
const emailRateLimiter = new Map();

export const rateLimitEmail = (email, windowMs = 60000, maxRequests = 5) => {
  const now = Date.now();
  const userRequests = emailRateLimiter.get(email) || [];

  // Remove old requests outside the window
  const recentRequests = userRequests.filter((time) => now - time < windowMs);

  if (recentRequests.length >= maxRequests) {
    return false;
  }

  recentRequests.push(now);
  emailRateLimiter.set(email, recentRequests);

  return true;
};
