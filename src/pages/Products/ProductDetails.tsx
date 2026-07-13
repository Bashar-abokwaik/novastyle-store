import { useQuery } from "@tanstack/react-query";

import type { productTemplate } from "../../types";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState } from "react";

import { useCart } from "../../hooks/useCart";

import { productsService } from "../../services/productsService";

import Button from "../../components/UI/Buttons/Button";
import Spinner from "../../components/UI/Spinner/Spinner";

import styles from "./productDetails.module.css";

// Define the RootState interface to represent the structure of the Redux store's state.
interface RootState {
  auth: {
    token: string;
  };
}

// ProductResponse interface defines the structure of the response received when fetching product details.
interface ProductResponse {
  message: string;
  product: productTemplate;
}

function ProductDetails() {
  // State to manage the loading state when adding a product to the cart
  const [loading, setLoading] = useState(false);
  // Get the productId from the URL parameters and initialize navigation and cart management hooks.
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  // Destructure the addToCart function from the useCart hook and get the authentication token from the Redux store.
  const { addToCart } = useCart();
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);

  // Use React Query to fetch product details based on the productId from the URL parameters.
  const {
    data: product,
    error,
    isLoading,
  } = useQuery<ProductResponse, Error>({
    queryKey: ["products", productId],
    queryFn: async (): Promise<ProductResponse> =>
      (await productsService.getById(productId!)) as ProductResponse,
    enabled: !!productId,
  });

  // If the product details are still loading, show a spinner to indicate loading state.
  if (isLoading) {
    return <Spinner />;
  }

  // If there is an error fetching the product details, display an error message.
  if (error) {
    return <p className={styles.error}>Error: {error.message}</p>;
  }

  // Handler function to add the product to the cart. If the user is not logged in, navigate to the login page.
  const handleAddToCart = async () => {
    if (!token || !product) {
      navigate("/login");
      return;
    }
    setLoading(true);
    await addToCart(product.product._id as string);
    setLoading(false);
  };

  if (!product) {
    return <p className={styles.error}>Product not found</p>;
  }

  return (
    <div className={styles.productDetails}>
      <div className={styles.imageContainer}>
        {product?.product?.discount ? (
          <>
            <span className={styles.saleBadge}>🔥 SALE</span>
            <span className={styles.hotBadge}>HOT DEAL</span>
          </>
        ) : null}
        <img src={product?.product?.imageUrl} alt={product?.product?.title} />
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{product.product.title}</h1>
        <p className={styles.description}>{product.product.description}</p>
        <div className={styles.priceBox}>
          {product.product.discount ? (
            <>
              <span className={styles.oldPrice}>
                ${product.product.price.toFixed(2)}
              </span>
              <span className={styles.newPrice}>
                $
                {(
                  product.product.price -
                  (product.product.price * product.product.discount) / 100
                ).toFixed(2)}
              </span>
              <span className={styles.discount}>-{product.product.discount}%</span>
            </>
          ) : (
            <span className={styles.price}>${product.product.price.toFixed(2)}</span>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={handleAddToCart} disabled={loading}>
            {loading ? "Adding..." : "Add to Cart"}
          </Button>

          <Button variant="primary" onClick={() => navigate(-1)}>
            Back
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
