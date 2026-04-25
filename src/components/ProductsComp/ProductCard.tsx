import type { productTemplate } from "../../services/mock/products.mock";
import { useNavigate  } from "react-router-dom";
import Button from "../UI/Buttons/Button";
import styles from "./products.module.css";

export default function ProductCard({ product }: { product: productTemplate }) {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/products/${product.id}`);
  };
  return (
    <div className={styles.card}>
      <img src={product.image} alt={product.title} />

      <div className={styles.cardBody}>
        <h3 className={styles.productsTitle}>{product.title}</h3>
        <p className={styles.price}>${product.price.toFixed(2)}</p>
        <div className={styles.cardActions}>
          <Button
            variant="primary"
            onClick={handleViewDetails}
          >
            View Details
          </Button>
          <Button variant="secondary">Add to Cart</Button>
        </div>
      </div>
    </div>
  );
}
