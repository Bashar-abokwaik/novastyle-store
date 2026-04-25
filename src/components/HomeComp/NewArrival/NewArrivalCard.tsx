import type { productTemplate } from "../../../services/mock/products.mock";
import { useNavigate } from "react-router-dom";
import styles from "./newArrival.module.css";

import Button from "../../UI/Buttons/Button";

export default function NewArrivalCard({
  product,
}: {
  product: productTemplate;
}) {
  const navigate = useNavigate();
  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };
  return (
    <div className={styles.card}>
      <div className={styles.imageWrapper}>
        <img src={product.image} alt={product.title} />
        <span className={styles.badge}>NEW</span>
      </div>

      <div className={styles.cardBody}>
        <h3 className={styles.cardTitle}>{product.title}</h3>
        <p className={styles.cardPrice}>${product.price.toFixed(2)}</p>

        <div className={styles.actions}>
          <Button variant="primary" onClick={handleViewDetails}>
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
