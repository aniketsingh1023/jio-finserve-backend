/**
 * Auth Validators
 * Centralized validation logic for authentication endpoints
 */

interface ValidationError {
  field: string;
  message: string;
}

interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

/**
 * Validate email format
 */
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate phone format (international or standard)
 */
const isValidPhone = (phone: string): boolean => {
  // Accepts formats: +91-9999999999, 9999999999, +91 9999999999
  const phoneRegex = /^(?:\+\d{1,3})?[\s-]?\d{10}$/;
  return phoneRegex.test(phone.replace(/\s|-/g, ''));
};

/**
 * Validate signup request body
 */
export const validateSignup = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!data.password || typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  // Validate phone (optional but valid if provided)
  if (data.phone) {
    if (typeof data.phone !== 'string') {
      errors.push({ field: 'phone', message: 'Phone must be a string' });
    } else if (!isValidPhone(data.phone)) {
      errors.push({ field: 'phone', message: 'Invalid phone format' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Validate login request body
 */
export const validateLogin = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!data.password || typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
