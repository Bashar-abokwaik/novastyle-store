import { api } from "./api/client";

// The dashboardService object provides methods for fetching dashboard data.
export const dashboardService = {
  // Fetch dashboard statistics from the backend API
    getDashboardStats: async () => {
    return api.get("/admin/dashboard", true);
  },
};
