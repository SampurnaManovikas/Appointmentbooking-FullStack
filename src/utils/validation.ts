/**
 * Validates phone number input - allows only numeric characters
 * @param value - Input value to validate
 * @returns Cleaned phone number string with only digits
 */
export const validatePhoneInput = (value: string): string => {
  // Remove all non-digit characters
  return value.replace(/\D/g, '');
};

/**
 * Formats phone number for display (XXX) XXX-XXXX
 * @param value - Phone number string (digits only)
 * @returns Formatted phone number string
 */
export const formatPhoneNumber = (value: string): string => {
  // Remove all non-digit characters
  const cleaned = value.replace(/\D/g, '');
  
  // Apply formatting based on length
  if (cleaned.length <= 3) {
    return cleaned;
  } else if (cleaned.length <= 6) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
  } else {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
};

/**
 * Validates if phone number is complete (10 digits)
 * @param value - Phone number string
 * @returns Boolean indicating if phone number is valid
 */
export const isValidPhoneNumber = (value: string): boolean => {
  const cleaned = value.replace(/\D/g, '');
  return cleaned.length === 10;
};

/**
 * Validates email format using regex
 * @param email - Email string to validate
 * @returns Boolean indicating if email format is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
};

/**
 * Validates required fields for form submission
 * @param data - Form data object
 * @returns Object with validation results and error messages
 */
export const validateFormData = (data: {
  clientName: string;
  clientPhone: string;
  clientEmail: string;
  date: Date | null;
  time: string;
}) => {
  const errors: string[] = [];
  
  // Validate name
  if (!data.clientName.trim()) {
    errors.push('Full name is required');
  } else if (data.clientName.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  // Validate phone
  if (!data.clientPhone.trim()) {
    errors.push('Phone number is required');
  } else if (!isValidPhoneNumber(data.clientPhone)) {
    errors.push('Please enter a valid 10-digit phone number');
  }
  
  // Validate email
  if (!data.clientEmail.trim()) {
    errors.push('Email address is required');
  } else if (!isValidEmail(data.clientEmail)) {
    errors.push('Please enter a valid email address');
  }
  
  // Validate date and time
  if (!data.date) {
    errors.push('Please select an appointment date');
  } else {
    // Check if date is in the past
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (data.date < today) {
      errors.push('Cannot book appointments for past dates');
    }
    
    // Check if it's a weekend
    const dayOfWeek = data.date.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      errors.push('Appointments are not available on weekends');
    }
  }
  
  if (!data.time) {
    errors.push('Please select an appointment time');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitize input data for API submission
 */
export const sanitizeBookingData = (data: any) => {
  return {
    ...data,
    clientName: data.clientName.trim(),
    clientEmail: data.clientEmail.trim().toLowerCase(),
    clientPhone: data.clientPhone.replace(/\D/g, ''), // Remove formatting
    notes: data.notes?.trim() || ''
  };
};