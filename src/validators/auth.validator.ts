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
 * Validate phone format
 */
const isValidPhone = (phone: string): boolean => {
  const normalizedPhone = phone.replace(/[\s-]/g, '');
  const phoneRegex = /^(?:\+\d{1,3})?\d{10}$/;
  return phoneRegex.test(normalizedPhone);
};

/**
 * Validate Indian pincode format
 */
const isValidPincode = (pincode: string): boolean => {
  const pincodeRegex = /^\d{6}$/;
  return pincodeRegex.test(pincode);
};

/**
 * Validate signup request body
 */
export const validateSignup = (data: any): ValidationResult => {
  const errors: ValidationError[] = [];

  // Validate email
  if (!data.email || typeof data.email !== 'string') {
    errors.push({ field: 'email', message: 'Email is required' });
  } else if (!isValidEmail(data.email.trim())) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!data.password || typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }

  // Validate name
  if (!data.name || typeof data.name !== 'string') {
    errors.push({ field: 'name', message: 'Name is required' });
  } else if (data.name.trim().length === 0) {
    errors.push({ field: 'name', message: 'Name cannot be empty' });
  }

  // Validate phone (optional but valid if provided)
  if (data.phone !== undefined && data.phone !== null && data.phone !== '') {
    if (typeof data.phone !== 'string') {
      errors.push({ field: 'phone', message: 'Phone must be a string' });
    } else if (!isValidPhone(data.phone.trim())) {
      errors.push({ field: 'phone', message: 'Invalid phone format' });
    }
  }

  // Validate city
  if (!data.city || typeof data.city !== 'string') {
    errors.push({ field: 'city', message: 'City is required' });
  } else if (data.city.trim().length === 0) {
    errors.push({ field: 'city', message: 'City cannot be empty' });
  }

  // Validate address
  if (!data.address || typeof data.address !== 'string') {
    errors.push({ field: 'address', message: 'Address is required' });
  } else if (data.address.trim().length < 5) {
    errors.push({
      field: 'address',
      message: 'Address must be at least 5 characters',
    });
  }

  // Validate pincode
  if (!data.pincode || typeof data.pincode !== 'string') {
    errors.push({ field: 'pincode', message: 'Pincode is required' });
  } else if (!isValidPincode(data.pincode.trim())) {
    errors.push({
      field: 'pincode',
      message: 'Pincode must be exactly 6 digits',
    });
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
  } else if (!isValidEmail(data.email.trim())) {
    errors.push({ field: 'email', message: 'Invalid email format' });
  }

  // Validate password
  if (!data.password || typeof data.password !== 'string') {
    errors.push({ field: 'password', message: 'Password is required' });
  } else if (data.password.length < 6) {
    errors.push({
      field: 'password',
      message: 'Password must be at least 6 characters',
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};