import { userService } from "../../services/userService";
import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";

import Toast from "../../components/UI/Toast/Toast";
import Spinner from "../../components/UI/Spinner/Spinner";
import OrderCard from "../../components/Orders/OrderCard";

import type { Order } from "../../types/index";

import styles from "./myOrders.module.css";

// OrderResponse interface defines the structure of the response received when fetching user orders, including a message and an array of Order objects.
interface OrderResponse {
  message: string;
  orders: Order[];
  total: number;
  page: number;
  pages: number;
}

export default function MyOrders() {
  // toastRef is a reference to the Toast component, allowing us to control its visibility and content.
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // State to manage the current page of orders for pagination.
  const [page, setPage] = useState(1);
  const limit = 10; // Number of orders per page

  // useQuery hook is used to fetch the user's orders from the server. It handles loading, error, and success states.
  const { data, isLoading, error } = useQuery<OrderResponse>({
    queryKey: ["userOrders", page],
    queryFn: async (): Promise<OrderResponse> => {
      try {
        const response = await userService.getUserOrders(page, limit);
        return response as OrderResponse;
      } catch (error) {
        setToastType("error");
        setToastMessage("Failed to fetch orders");
        showToast();
        throw error;
      }
    },
  });

  // If there is an error fetching the orders, display an error message.
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>Failed to load orders. Please try again later.</p>
      </div>
    );
  }

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <h2>My Orders</h2>
        <p>Review your past purchases and track current orders</p>
      </div>
      {isLoading && (
        <div className={styles.spinnerContainer}>
          <Spinner />
        </div>
      )}
      <div className={styles.ordersList}>
        {data?.orders.length === 0 ? (
          <div className={styles.emptyContainer}>
            <h3>No Orders Yet</h3>
            <p>Looks like you haven't placed any orders yet.</p>
          </div>
        ) : (
          data?.orders.map((order) => (
            <OrderCard key={order._id} order={order} />
          ))
        )}
      </div>
      {data && data.pages > 1 && (
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {data.pages}
          </span>

          <button
            disabled={page === data.pages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
      <Toast ref={toastRef} type={toastType} message={toastMessage} />
    </section>
  );
}
