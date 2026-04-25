import { useNavigate } from "react-router-dom";

import type { productTemplate } from "../../../services/mock/products.mock";
import { productsService } from "../../../services/productsService";
import styles from "./offers.module.css";

import Button from "../../UI/Buttons/Button";

export default function OffersCard({ product }: { product: productTemplate }) {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/offers/${product.id}`);
  };
  return (
    <div className={styles.offerCard}>
      <img
        src={product.image}
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
            {productsService
              .getDiscountedPrice(product.price, product.discount || 0)
              .toFixed(2)}
          </span>
          <span className={styles.discountBadge}>{product.discount}% OFF</span>
        </p>
        <div className={styles.offerActions}>
          <Button
            variant="primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button
            variant="secondary"
            onClick={() => alert(`Added ${product.title} to cart`)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
