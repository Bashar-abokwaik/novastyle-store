import type { productTemplate } from "../../../types/index";
import { useNavigate } from "react-router-dom";
import styles from "./newArrival.module.css";
import { useState } from "react";

import { useSelector } from "react-redux";

import Button from "../../UI/Buttons/Button";
import {useCart} from "../../../hooks/useCart";

// Define the structure of the Redux state for authentication
interface RootState {
  auth: {
    token: string;
  };
}

export default function NewArrivalCard({
  product,
}: {
  product: productTemplate;
}) {
  // State to manage the loading state when adding a product to the cart
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Access the authentication token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);
  // Use the custom useCart hook to manage cart actions
  const { addToCart } = useCart();

  // Handler for adding a product to the cart. If the user is not authenticated, they are redirected to the login page.
  const handleAddToCart = async () => {
    if (!token) {
      navigate("/login");
      return;
    }
    setLoading(true);
    await addToCart(product._id);
    setLoading(false);
  };

  // Handler for viewing product details, navigates to the product's page
  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };
  
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.imageUrl} alt={product.title} />
        <span className={styles.badge}>NEW</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{product.title}</h3>
        <p className={styles.cardPrice}>${product.price.toFixed(2)}</p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={handleViewDetails}>
            View Details
          </Button>
          <Button variant="secondary" onClick={handleAddToCart} disabled={loading}>
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
