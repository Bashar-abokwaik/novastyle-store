// Validation utility functions for form fields
export const isValidEmail = (email: string) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

// Validation utility function for password strength
export const isValidPassword = (password: string) => {
  return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
};

// Function to validate individual form fields based on their name and value
export const validateField = (name: string, value: string) => {
  const optionalFields = ["subject"];
  if (optionalFields.includes(name)) return "";
  if (!value.trim()) return "This field is required";
  if (name === "email" && !/\S+@\S+\.\S+/.test(value)) return "Invalid email";
  return "";
};
