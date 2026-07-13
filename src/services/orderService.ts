import { api } from "./api/client";

// The orderService object provides methods for managing orders.
export const orderService = {
  // Place a new order with shipping address and payment method
  placeOrder: async (
    shippingAddress: {
      country: string;
      city: string;
      street: string;
      postalCode: string;
    },
    paymentMethod: string,
  ) => {
    return api.post(
      "/orders",
      {
        shippingAddress,
        paymentMethod,
      },
      true,
    );
  },
  // Retrieve an order by its ID
  getOrderById: async (orderId: string) => {
    return api.get(`/orders/${orderId}`, true);
  },
  // Cancel an order by its ID
  cancelOrder: async (orderId: string) => {
    return api.put(`/orders/${orderId}/cancel`, {}, true);
  },

  // Retrieve all orders (admin)
  adminGetAllOrders: async () => {
    return api.get("/orders/admin", true);
  },
  // Update the status of an order (admin)
  adminUpdateOrderStatus: async (orderId: string, status: string) => {
    return api.put(`/orders/admin/${orderId}/status`, { status }, true);
  },
  // Retrieve orders by date range (admin)
  adminGetOrdersByDateRange: async (startDate: string, endDate: string) => {
    return api.get(
      `/orders/admin?startDate=${startDate}&endDate=${endDate}`,
      true,
    );
  },
  // Retrieve orders by user ID (admin)
  adminGetOrdersByUserId: async (userId: string) => {
    return api.get(`/orders/admin/user/${userId}`, true);
  },
  // Delete an order by its ID (admin)
  adminDeleteOrder: async (orderId: string) => {
    return api.delete(`/orders/admin/${orderId}`, true);
  },
  // Retrieve an order by its ID (admin)
  adminGetOrderById: async (orderId: string) => {
    return api.get(`/orders/admin/${orderId}`, true);
  },
};
