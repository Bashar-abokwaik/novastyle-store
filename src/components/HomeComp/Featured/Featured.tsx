import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { productsService } from "../../../services/productsService";

import type { productTemplate } from "../../../services/mock/products.mock";

import Button from "../../UI/Buttons/Button";

import styles from "./featured.module.css";

export default function Featured() {
  const [featuredProducts, setFeaturedProducts] = useState<productTemplate[]>(
    [],
  );

  useEffect(() => {
    productsService
      .getFeatured()
      .then((data) => setFeaturedProducts(data as productTemplate[]))
      .catch((error) =>
        console.error("Error fetching featured products:", error),
      );
  }, []);

  const navigate = useNavigate();

  const handleViewDetails = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Featured Picks</h2>

      <div className={styles.grid}>
        {featuredProducts.map((product) => (
          <div key={product.id} className={styles.card}>
            <img src={product.image} alt={product.title} />

            <div className={styles.info}>
              <h3 className={styles.title}>{product.title}</h3>
              <p className={styles.description}>{product.description}</p>

              <Button
                variant="primary"
                onClick={() => handleViewDetails(product.id)}
              >
                View Details
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
