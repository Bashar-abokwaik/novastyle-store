import { api } from "./api/client";

// The userService object provides methods for managing user-related operations.
export const userService = {
  // Retrieve all users (admin only)
  getAllUsers: async (page: number, limit: number) => {
    return api.get(`/user/admin?page=${page}&limit=${limit}`, true);
  },

  // Retrieve a user by their ID (admin only)
  getUserById: async (id: string) => {
    return api.get(`/user/admin/${id}`, true);
  },

  // Retrieve the profile of the currently logged-in user
  getUserProfile: async () => {
    return api.get("/user/me", true);
  },

  // Update the profile of the currently logged-in user
  updateUserProfile: async (data: Record<string, unknown>) => {
    return api.put("/user/me", data, true);
  },

  // Retrieve the orders of the currently logged-in user
  getUserOrders: async (page: number, limit: number) => {
    return api.get(`/user/orders?page=${page}&limit=${limit}`, true);
  },

  // Retrieve the cart of the currently logged-in user
  getUserCart: async () => {
    return api.get("/user/cart", true);
  },

  // Retrieve the address of the currently logged-in user
  getUserAddress: async () => {
    return api.get("/user/address", true);
  },

  // Update the address of the currently logged-in user
  updateUserAddress: async (address: Record<string, string>) => {
    return api.put("/user/address", address, true);
  },
};
