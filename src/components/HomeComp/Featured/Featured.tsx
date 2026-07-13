import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { productsService } from "../../../services/productsService";
import Button from "../../UI/Buttons/Button";
import Placeholder from "../../UI/Placeholder/Placeholder";

import styles from "./featured.module.css";

import type { productTemplate } from "../../../types";

// Define the structure of the response expected from the featured products API
interface FeaturedResponse {
  message: string;
  products: productTemplate[];
}

export default function Featured() {
  // Use React Query to fetch featured products data from the API
  const {
    data: featuredProducts,
    error,
    isLoading,
  } = useQuery<FeaturedResponse, Error>({
    queryKey: ["featuredProducts"],
    queryFn: async (): Promise<FeaturedResponse> =>
      (await productsService.getFeatured()) as FeaturedResponse,
  });

  const navigate = useNavigate();

  // Handler for clicking on a product card, navigates to the product's page
  const handleViewDetails = (productId: string | number | boolean | object | undefined) => {
    navigate(`/products/${productId}`);
  };

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Featured Picks</h2>

      <div className={styles.grid}>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => (
            <Placeholder key={i} hasActions={1} />
          ))}
        {!isLoading &&
          featuredProducts?.products?.map((product) => (
            <div key={product._id as React.Key} className={styles.card}>
              <img src={product.imageUrl} alt={product.title} />

              <div className={styles.info}>
                <h3 className={styles.title}>{product.title}</h3>
                <p className={styles.description}>{product.description}</p>

                <Button
                  variant="primary"
                  onClick={() => handleViewDetails(String(product._id))}
                >
                  View Details
                </Button>
              </div>
            </div>
          ))}
      </div>
      {error && <p>{error.message}</p>}
    </section>
  );
}
