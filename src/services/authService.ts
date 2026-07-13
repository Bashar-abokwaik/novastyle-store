import { api } from "./api/client";

// The authService object provides methods for user authentication and account management.

export const authService = {
  // Register a new user
  register: async (
    name: string,
    email: string,
    password: string
  ) => {
    return api.post("/auth/register", {
      name,
      email,
      password,
    });
  },

  // Verify the user's email using an OTP
  verifyEmail: async (
    email: string,
    otp: string
  ) => {
    return api.post("/auth/verify-email", {
      email,
      otp,
    });
  },

  // Resend the OTP for email verification
  resendOtp: async (
    email: string
  ) => {
    return api.post("/auth/resend-otp", {
      email,
    });
  },

  // Log in a user and retrieve their authentication token
  login: async (
    email: string,
    password: string
  ) => {
    return api.post("/auth/login", {
      email,
      password,
    });
  },

  // Log out the current user
  logout: async () => {
    return api.post("/auth/logout", {}, true);
  },

  // Initiate the password reset process for a user
  forgetPassword: async (
    email: string
  ) => {
    return api.post("/auth/forget-password", {
      email,
    });
  },

  // Reset the user's password using a token
  resetPassword: async (
    token: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    return api.post(`/auth/reset-password/${token}`, {
      newPassword,
      confirmPassword,
    });
  },

  // Change the user's password while logged in
  changePassword: async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ) => {
    return api.post("/auth/change-password", {
      currentPassword,
      newPassword,
      confirmPassword,
    }, true);
  }
  
};