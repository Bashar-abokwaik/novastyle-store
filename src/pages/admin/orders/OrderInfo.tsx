import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { orderService } from "../../../services/orderService";

import type { Order, OrderItem } from "../../../types";
import styles from "./Orders.module.css";

import Spinner from "../../../components/UI/Spinner/Spinner";

// OrderResponse interface defines the structure of the response received when fetching a specific order, including a message and an Order object.
interface OrderResponse {
  message: string;
  order: Order;
}

export default function OrderInfo() {
  // Extract the orderId parameter from the URL using useParams hook. This ID is used to fetch the specific order details from the server.
  const { orderId } = useParams();
  // Initialize the query client from React Query to manage and invalidate queries.
  const queryClient = useQueryClient();

  // Use the useQuery hook from React Query to fetch the order details based on the orderId. It handles loading, error, and success states.
  const { data, isLoading } = useQuery<OrderResponse>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID is required");
      }
      const response = await orderService.adminGetOrderById(orderId);
      return response as OrderResponse;
    },
  });

  // Use the useMutation hook to handle updating the status of an order. On success, it invalidates the relevant queries to refresh the data.
  const updateStatus = useMutation({
    mutationFn: (status: string) =>
      orderService.adminUpdateOrderStatus(orderId!, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["order", orderId] });
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    },
  });

  // Extract the order from the fetched data, defaulting to undefined if no data is available.
  const order = data?.order;

  // Display a spinner while the order is being fetched. If the order is not found, display an error message.
  if (isLoading) return <Spinner />;
  if (!order) return <p>Order not found</p>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Order #{order._id}</h1>

      <div className={styles.detailsContainer}>
        <div className={styles.grid}>
          <div className={styles.card}>
            <h3>User</h3>
            <p>{order.userId.email}</p>
          </div>

          <div className={styles.card}>
            <h3>Status</h3>

            <select
              value={order.status}
              onChange={(e) =>
                updateStatus.mutate(e.target.value)
              }
            >
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        {/* ITEMS */}
        <div className={styles.card}>
          <h3>Items</h3>

          <div className={styles.itemsList}>
            {order.items.map((item: OrderItem) => (
              <div key={item._id} className={styles.item}>
                <span>{item.productId.title}</span>
                <span>x{item.quantity}</span>
              </div>
            ))}
          </div>

          <div className={styles.totalBox}>Total: ${order.totalAmount}</div>
        </div>
      </div>
    </div>
  );
}
