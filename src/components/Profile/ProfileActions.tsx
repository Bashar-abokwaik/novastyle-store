import { useNavigate } from "react-router-dom";
import { FaBoxOpen, FaShoppingBag } from "react-icons/fa";

import styles from "./profile.module.css";

// Define the ProfileActions component, which provides quick action buttons for users to navigate to their orders and browse products. It uses React Router's useNavigate hook for navigation and displays icons for each action.
export default function ProfileActions() {
  const navigate = useNavigate();

  return (
    <div className={styles.actionsCard}>
      <h2>Quick Actions</h2>

      <div className={styles.actionsGrid}>
        <button
          className={styles.actionItem}
          onClick={() => navigate("/orders")}
        >
          <FaBoxOpen />
          <span>My Orders</span>
        </button>

        <button
          className={styles.actionItem}
          onClick={() => navigate("/products")}
        >
          <FaShoppingBag />
          <span>Browse Products</span>
        </button>
      </div>
    </div>
  );
}
