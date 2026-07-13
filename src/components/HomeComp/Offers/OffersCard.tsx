import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {useState} from "react";

import type { productTemplate } from "../../../types/index";
import styles from "./offers.module.css";

import Button from "../../UI/Buttons/Button";

import { useCart } from "../../../hooks/useCart";

import { getDiscountedPrice } from "../../../utils/discountedPrice";

// Define the structure of the Redux state for authentication
interface RootState {
  auth: {
    token: string;
  };
}
export default function OffersCard({ product }: { product: productTemplate }) {
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
    navigate(`/offers/${product._id}`);
  };
  return (
    <div className={styles.offerCard}>
      <img
        src={product.imageUrl}
        alt={product.title}
        className={styles.offerImage}
      />
      <div className={styles.offerDetails}>
        <h3 className={styles.offerTitle}>{product.title}</h3>
        <p className={styles.offerPrice}>
          <span className={styles.originalPrice}>
            ${product.price.toFixed(2)}
          </span>
          <span className={styles.discountedPrice}>
            $
            {getDiscountedPrice(product.price, product.discount || 0).toFixed(
              2,
            )}
          </span>
          <span className={styles.discountBadge}>{product.discount}% OFF</span>
        </p>
        <div className={styles.offerActions}>
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
