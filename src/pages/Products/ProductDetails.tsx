import { type productTemplate } from "../../services/mock/products.mock";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { productsService } from "../../services/productsService";

import Button from "../../components/UI/Buttons/Button";

import styles from "./productDetails.module.css";

function ProductDetails() {
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();

  const [product, setProduct] = useState<productTemplate | null>(null);

  useEffect(() => {
    if (!productId) return;

    productsService
      .getById(productId)
      .then((data) => setProduct(data as productTemplate))
      .catch((error) =>
        console.error("Error fetching product details:", error),
      );
  }, [productId]);

  if (!product) {
    return <p className={styles.loading}>Loading...</p>;
  }

  return (
    <div className={styles.productDetails}>
      <div className={styles.imageContainer}>
        {product.discount ? (
          <>
            <span className={styles.saleBadge}>🔥 SALE</span>
            <span className={styles.hotBadge}>HOT DEAL</span>
          </>
        ) : null}
        <img src={product.image} alt={product.title} />
      </div>

      <div className={styles.info}>
        <h1 className={styles.title}>{product.title}</h1>
        <p className={styles.description}>{product.description}</p>
        <div className={styles.priceBox}>
          {product.discount ? (
            <>
              <span className={styles.oldPrice}>
                ${product.price.toFixed(2)}
              </span>
              <span className={styles.newPrice}>
                $
                {(
                  product.price -
                  (product.price * product.discount) / 100
                ).toFixed(2)}
              </span>
              <span className={styles.discount}>-{product.discount}%</span>
            </>
          ) : (
            <span className={styles.price}>${product.price.toFixed(2)}</span>
          )}
        </div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={() => alert("Added to cart")}>
            Add to Cart
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
