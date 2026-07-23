import type { productTemplate } from "../../types";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import { useCart } from "../../hooks/useCart";

import Button from "../UI/Buttons/Button";
import styles from "./products.module.css";

interface RootState {
  auth: {
    token: string;
  };
}

export default function ProductCard({ product }: { product: productTemplate }) {
  // State to manage the loading state when adding a product to the cart
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  // Use the custom useCart hook to manage cart actions
  const { addToCart } = useCart();

  // Access the authentication token from the Redux store
  const token = useSelector((state: RootState) => state.auth.token);

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

  const handleViewDetails = () => {
    navigate(`/products/${product._id}`);
  };

  // Check if the product has a discount
  const hasDiscount = (product.discount ?? 0) > 0;

  const finalPrice = hasDiscount
    ? product.price - (product.price * product.discount!) / 100
    : product.price;

  return (
    <div className={styles.card}>
      <img src={product.imageUrl} alt={product.title} />
      {hasDiscount && (
        <span className={styles.saleBadge}>{product.discount}% OFF</span>
      )}

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{product.title}</h3>

        <p className={styles.description}>{product.description}</p>

        <div className={styles.priceSection}>
          {hasDiscount ? (
            <>
              <span className={styles.oldPrice}>
                ${product.price.toFixed(2)}
              </span>

              <span className={styles.newPrice}>${finalPrice.toFixed(2)}</span>

              <span className={styles.discountBadge}>-{product.discount}%</span>
            </>
          ) : (
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          )}
        </div>

        <div className={styles.cardActions}>
          <Button variant="primary" onClick={handleViewDetails}>
            View Details
          </Button>

          <Button
            variant="secondary"
            onClick={handleAddToCart}
            disabled={loading}
          >
            {loading ? "Adding..." : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
