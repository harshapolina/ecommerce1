export const validatePassword = (password) => {
  const errors = [];

  if (password.length < 8) {
    errors.push("Password must be at least 8 characters");
  }

  if (!/[A-Z]/.test(password)) {
    errors.push("Must contain one uppercase letter");
  }

  if (!/[a-z]/.test(password)) {
    errors.push("Must contain one lowercase letter");
  }

  if (!/[0-9]/.test(password)) {
    errors.push("Must contain one number");
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push("Must contain one special character");
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

