import { useQuery } from "@tanstack/react-query";
import { useState, useRef } from "react";
import { useParams } from "react-router-dom";

import { orderService } from "../../services/orderService";

import { getDiscountedPrice } from "../../utils/discountedPrice";

import Toast from "../../components/UI/Toast/Toast";
import Spinner from "../../components/UI/Spinner/Spinner";

import type { Order } from "../../types/index";

import styles from "./orderPage.module.css";

// OrderResponse interface defines the structure of the response received when fetching a specific order, including a message and an Order object.
interface OrderResponse {
  message: string;
  order: Order;
}

export default function OrderPage() {
  // Extract the orderId parameter from the URL using useParams hook. This ID is used to fetch the specific order details from the server.
  const { orderId } = useParams<{ orderId: string }>();
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

  // Use the useQuery hook from React Query to fetch the order details based on the orderId.
  const { data, isLoading } = useQuery<OrderResponse>({
    queryKey: ["order", orderId],
    queryFn: async () => {
      if (!orderId) {
        throw new Error("Order ID is required");
      }
      try {
        const response = (await orderService.getOrderById(
          orderId,
        )) as OrderResponse;
        return response;
      } catch (error) {
        setToastType("error");
        setToastMessage("Failed to fetch order");
        showToast();
        throw error;
      }
    },
  });

  // Render different UI based on the loading state of the query.
  if (isLoading) {
    return (
      <div className={styles.spinnerContainer}>
        <Spinner />
      </div>
    );
  }

  return (
    <section className={styles.container}>
      {data?.order && (
        <>
          <div className={styles.card}>
            <div className={styles.top}>
              <div>
                <h2>Order #{data.order._id.slice(-8)}</h2>
                <p>{new Date(data.order.createdAt).toLocaleDateString()}</p>
              </div>

              <span className={`${styles.status} ${styles[data.order.status]}`}>
                {data.order.status}
              </span>
            </div>

            <div className={styles.infoGrid}>
              <div>
                <h4>Payment Method</h4>
                <p>{data.order.paymentMethod}</p>
              </div>

              <div>
                <h4>Total Amount</h4>
                {/* Calculate the total amount by summing up the discounted prices of all items in the order, multiplied by their respective quantities.
                 The result is formatted to two decimal places. */}
                <p>
                  $
                  {data.order.items
                    .reduce(
                      (acc, item) =>
                        acc +
                        getDiscountedPrice(
                          item.productId.price,
                          item.productId.discount ?? 0,
                        ) *
                          item.quantity,
                      0,
                    )
                    .toFixed(2)}
                </p>
              </div>
            </div>

            <div className={styles.address}>
              <h3>Shipping Address</h3>

              <p>{data.order.shippingAddress.country}</p>
              <p>{data.order.shippingAddress.city}</p>
              <p>{data.order.shippingAddress.street}</p>
              <p>{data.order.shippingAddress.postalCode}</p>
            </div>

            <div className={styles.products}>
              <h3>Products</h3>

              {data.order.items.map((item) => (
                <div key={item._id} className={styles.product}>
                  <img
                    src={item.productId.imageUrl}
                    alt={item.productId.title}
                  />

                  <div>
                    <h4>{item.productId.title}</h4>

                    <p>Qty: {item.quantity}</p>

                    <p>
                      $
                      {(
                        getDiscountedPrice(
                          item.productId.price,
                          item.productId.discount ?? 0,
                        ) * item.quantity
                      ).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <Toast ref={toastRef} type={toastType} message={toastMessage} />
    </section>
  );
}
