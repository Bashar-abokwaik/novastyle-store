import { api } from "./api/client";

// The cartService object provides methods for managing the user's shopping cart.
export const cartService = {
  // Retrieve the current user's shopping cart
  getCart: async () => {
    return api.get("/cart", true);
  },

  // Add an item to the user's shopping cart
  addItem: async (productId: string, quantity: number) => {
    return api.post(
      "/cart",
      {
        productId,
        quantity,
      },
      true,
    );
  },

  // Remove an item from the user's shopping cart
  removeItem: async (productId: string) => {
    return api.post(`/cart/remove`, { productId }, true);
  },

  // Increase the quantity of an item in the user's shopping cart
  increaseQuantity: async (productId: string) => {
    return api.post(`/cart/increase`, { productId }, true);
  },

  // Decrease the quantity of an item in the user's shopping cart
  decreaseQuantity: async (productId: string) => {
    return api.post(`/cart/decrease`, { productId }, true);
  },

  // Clear all items from the user's shopping cart
  clearCart: async () => {
    return api.post("/cart/clear", {}, true);
  },

  // Checkout the user's shopping cart
  checkoutCart: async (shippingAddress: string, paymentMethod: string) => {
    return api.post(
      "/cart/checkout",
      {
        shippingAddress,
        paymentMethod,
      },
      true,
    );
  },
};
