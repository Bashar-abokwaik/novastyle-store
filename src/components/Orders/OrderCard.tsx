import { useNavigate } from "react-router-dom";
import type { Order } from "../../types";

import styles from "./orderCard.module.css";

// OrderCard component displays a summary of an order, including its ID, status, number of products, date, and total amount. It also provides a button to view detailed information about the order.
interface Props {
  order: Order;
}

export default function OrderCard({ order }: Props) {
  const navigate = useNavigate();

  // getStatusClass function returns a CSS class based on the order status to style the status label accordingly.
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return styles.pending;

      case "processing":
        return styles.processing;

      case "shipped":
        return styles.shipped;

      case "delivered":
        return styles.delivered;

      case "cancelled":
        return styles.cancelled;

      default:
        return styles.pending;
    }
  };

  return (
    <article className={styles.card}>
      <div className={styles.top}>
        <h3>#{order._id.slice(-8)}</h3>

        <span className={`${styles.status} ${getStatusClass(order.status)}`}>
          {order.status}
        </span>
      </div>

      <div className={styles.info}>
        <p>{order.items.length} Products</p>

        <p>{new Date(order.createdAt).toLocaleDateString()}</p>
      </div>

      <div className={styles.bottom}>
        <h4>${order.totalAmount.toFixed(2)}</h4>

        <button onClick={() => navigate(`/orders/${order._id}`)}>
          View Details
        </button>
      </div>
    </article>
  );
}
