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
  return (
    <div className={styles.card}>
      <img src={product.imageUrl} alt={product.title} />

      <div className={styles.cardBody}>
        <h3 className={styles.productsTitle}>{product.title}</h3>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <p className={styles.description}>
          {product.description.slice(0, 30)}
          {product.description.length > 30 ? "..." : ""}
        </p>
        <div className={styles.cardActions}>
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
