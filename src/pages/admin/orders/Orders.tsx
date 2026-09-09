import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import styles from "./Orders.module.css";

import { orderService } from "../../../services/orderService";

import type { Order } from "../../../types";

import Spinner from "../../../components/UI/Spinner/Spinner";
import { useState, useRef } from "react";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

// OrderResponse interface defines the structure of the response received when fetching all orders, including a message and an array of Order objects.
interface OrderResponse {
  message: string;
  orders: Order[];
  page: number;
  pages: number;
  limit: number;
}

export default function AdminOrders() {
  // Initialize the query client and navigation hook from React Router.
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Create a reference for the confirmation dialog and a state variable to hold the ID of the order to be cancelled.
  const confirmDialogRef = useRef<HTMLDialogElement>(null);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const limit = 10; // Number of orders per page

  // Use the useQuery hook to fetch all orders for the admin dashboard. It handles loading, error, and success states.
  const { data, isLoading, error } = useQuery<OrderResponse>({
    queryKey: ["admin-orders", page],
    queryFn: async (): Promise<OrderResponse> => {
      try {
        const response = await orderService.adminGetAllOrders(page, limit);
        return response as OrderResponse;
      } catch {
        throw new Error("Failed to fetch orders");
      }
    },
  });

  // Extract the orders from the fetched data, defaulting to an empty array if no data is available.
  const orders = data?.orders || [];

  // Use the useMutation hook to handle updating the status of an order. On success, it invalidates the relevant queries to refresh the data.
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      orderService.adminUpdateOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders", page] });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: (id: string) => orderService.adminCancelOrder(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-orders", page] });
    },
  });

  // Display a spinner while the orders are being fetched. If there's an error, display an error message.
  if (isLoading) return <Spinner />;
  if (error) return <p className={styles.error}>Error loading orders</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Orders Management</h1>

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order: Order) => (
              <tr
                key={order._id}
                className={
                  order.status === "cancelled" ? styles.cancelledRow : ""
                }
              >
                <td>{order._id.slice(0, 8)}...</td>
                <td>{order.userId?.email}</td>
                <td>${order.totalAmount}</td>
                <td>
                  <select
                    className={styles.statusSelect}
                    value={order.status}
                    onChange={(e) =>
                      updateStatusMutation.mutate({
                        id: order._id,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    {order.status === "cancelled" && (
                      <option value="cancelled">Cancelled</option>
                    )}
                  </select>
                </td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className={styles.actions}>
                  <button
                    className={`${styles.actionButton} ${styles.cancelButton}`}
                    disabled={order.status === "cancelled"}
                    onClick={() => {
                      setOrderToCancel(order._id);
                      confirmDialogRef.current?.showModal();
                    }}
                  >
                    {order.status === "cancelled"
                      ? "Cancelled"
                      : "Cancel Order"}
                  </button>
                  <button
                    className={styles.actionButton}
                    onClick={() => navigate(`/admin/orders/${order._id}`)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.pagination}>
        <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Previous
        </button>

        <span>
          Page {page} of {data?.pages}
        </span>

        <button
          disabled={page === data?.pages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>
      <ConfirmDialog
        ref={confirmDialogRef}
        title="Cancel Order"
        message="Are you sure you want to cancel this order?"
        onConfirm={() => {
          if (orderToCancel) {
            cancelMutation.mutate(orderToCancel);
          }
        }}
      />
    </div>
  );
}
