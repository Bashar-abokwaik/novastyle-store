import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";
import type { Order } from "../../../types";

import Spinner from "../../../components/UI/Spinner/Spinner";

import styles from "./dashboard.module.css";

import { dashboardService } from "../../../services/dashboardService";

// Define the structure of the dashboard statistics returned from the API
interface DashboardStats {
  totalUsers: number;
  totalProducts: number;
  totalOrders: number;
  totalRevenue: number;
  openOrders: Order[];
}

export default function Dashboard() {
  // Use React Query to fetch the dashboard statistics from the backend API
  const { data, isLoading, error } = useQuery<DashboardStats>({
    queryKey: ["dashboardStats"],
    queryFn: () =>
      dashboardService.getDashboardStats() as Promise<DashboardStats>,
  });

  // Display a spinner while any of the queries are loading
  if (isLoading) {
    return <Spinner />;
  }

  // Display an error message if any of the queries encounter an error
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Extract the data from the queries, defaulting to empty arrays if the data is undefined. Calculate total revenue and filter open orders for display in the dashboard.
  const totalUsers = data?.totalUsers || 0;
  const totalProducts = data?.totalProducts || 0;
  const totalOrders = data?.totalOrders || 0;
  const totalRevenue = data?.totalRevenue || 0;
  const openOrders = data?.openOrders || [];

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard Overview</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Users</h3>
          <p>{totalUsers}</p>
        </div>

        <div className={styles.card}>
          <h3>Products</h3>
          <p>{totalProducts}</p>
        </div>

        <div className={styles.card}>
          <h3>Orders</h3>
          <p>{totalOrders}</p>
        </div>

        <div className={styles.card}>
          <h3>Revenue</h3>
          <p>${totalRevenue.toFixed(2)}</p>
        </div>
      </div>

      <div className={styles.section}>
        <h2>Open Orders</h2>

        {openOrders.length === 0 ? (
          <p>No open orders.</p>
        ) : (
          <div className={styles.ordersList}>
            {openOrders.slice(0, 5).map((order: Order) => (
              <NavLink
                key={order._id}
                to={`/admin/orders/${order._id}`}
                className={styles.orderCard}
              >
                <div>
                  <h4>Order #{order._id.slice(-6)}</h4>
                  <span className={styles.orderDate}>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className={styles.orderInfo}>
                  <span className={`${styles.status} ${styles[order.status]}`}>
                    {order.status}
                  </span>
                  <span className={styles.amount}>${order.totalAmount}</span>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <h2>Quick Actions</h2>

        <div className={styles.actions}>
          <NavLink to="/admin/products/add" className={styles.button}>
            Add Product
          </NavLink>

          <NavLink to="/admin/orders" className={styles.button}>
            View Orders
          </NavLink>

          <NavLink to="/admin/users" className={styles.button}>
            Manage Users
          </NavLink>
        </div>
      </div>
    </div>
  );
}
