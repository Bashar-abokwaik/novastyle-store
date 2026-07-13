import { useQuery } from "@tanstack/react-query";
import { NavLink } from "react-router-dom";

import { userService } from "../../../services/userService";
import { productsService } from "../../../services/productsService";
import { orderService } from "../../../services/orderService";

import Spinner from "../../../components/UI/Spinner/Spinner";

import styles from "./dashboard.module.css";

import type { User } from "../../../types/index";
import type { productTemplate } from "../../../types/index";
import type { Order } from "../../../types/index";

// OrderResponse interface defines the structure of the response received when fetching orders, including a message, an array of Order objects, total number of orders, and total revenue.
interface OrderResponse {
  message: string;
  orders: Order[];
  totalOrders: number;
  totalRevenue: number;
}

// ProductResponse interface defines the structure of the response received when fetching products, including a message, an array of productTemplate objects, and total number of products.
interface ProductResponse {
  message: string;
  products: productTemplate[];
  totalProducts: number;
}

// UserResponse interface defines the structure of the response received when fetching users, including a message, an array of User objects, and total number of users.
interface UserResponse {
  message: string;
  users: User[];
  totalUsers: number;
}

export default function Dashboard() {
  // Use React Query to fetch users, products, and orders data for the admin dashboard. Each query is associated with a unique query key and a function that fetches the respective data from the server.
  const usersQuery = useQuery<UserResponse>({
    queryKey: ["admin-users"],
    queryFn: async () => userService.getAllUsers() as Promise<UserResponse>,
  });

  const productsQuery = useQuery<ProductResponse>({
    queryKey: ["admin-products"],
    queryFn: async () =>
      productsService.getAllProductsAdmin() as Promise<ProductResponse>,
  });

  const ordersQuery = useQuery<OrderResponse>({
    queryKey: ["admin-orders"],
    queryFn: async () =>
      orderService.adminGetAllOrders() as Promise<OrderResponse>,
  });

  // Display a spinner while any of the queries are loading
  if (
    usersQuery.isLoading ||
    productsQuery.isLoading ||
    ordersQuery.isLoading
  ) {
    return <Spinner />;
  }

  // Display an error message if any of the queries encounter an error
  if (usersQuery.error || productsQuery.error || ordersQuery.error) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load dashboard data. Please try again later.</p>
      </div>
    );
  }

  // Extract the data from the queries, defaulting to empty arrays if the data is undefined. Calculate total revenue and filter open orders for display in the dashboard.
  const users = usersQuery.data?.users || [];
  const products = productsQuery.data?.products || [];
  const orders = ordersQuery.data?.orders || [];

  // Calculate total revenue by summing the totalAmount of all orders. Filter open orders to include only those that are not delivered or cancelled.
  const revenue = orders.reduce(
    (sum: number, order: Order) => sum + order.totalAmount,
    0,
  );

  // Filter open orders to include only those that are not delivered or cancelled. This will be used to display a list of open orders in the dashboard.
  const openOrders = orders.filter(
    (order: Order) =>
      order.status !== "delivered" && order.status !== "cancelled",
  );

  return (
    <div className={styles.dashboard}>
      <h1 className={styles.title}>Dashboard Overview</h1>

      <div className={styles.cards}>
        <div className={styles.card}>
          <h3>Users</h3>
          <p>{users.length}</p>
        </div>

        <div className={styles.card}>
          <h3>Products</h3>
          <p>{products.length}</p>
        </div>

        <div className={styles.card}>
          <h3>Orders</h3>
          <p>{orders.length}</p>
        </div>

        <div className={styles.card}>
          <h3>Revenue</h3>
          <p>${revenue.toFixed(2)}</p>
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
