import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import type { productTemplate } from "../../../types/index";

import { productsService } from "../../../services/productsService";

import styles from "./offers.module.css";
import OffersCard from "./OffersCard";
import Placeholder from "../../UI/Placeholder/Placeholder";

// Define the structure of the response expected from the offers API
interface OffersResponse {
  message: string;
  products: productTemplate[];
}

export default function Offers() {
  // Use React Query to fetch offers data from the API
  const {
    data: offers,
    error,
    isLoading,
  } = useQuery<OffersResponse, Error>({
    queryKey: ["offers"],
    queryFn: async (): Promise<OffersResponse> =>
      (await productsService.getOffers()) as OffersResponse,
  });

  return (
    <section className={styles.offers} id="offers">
      <h2 className={styles.sectionTitle}>Special Offers</h2>
      {error && <p>{error.message}</p>}
      <div className={styles.offersContainer}>
        {/* Display placeholders while loading, or the first 4 offer products once loaded */}
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <Placeholder key={i} hasActions={2} />
            ))
          : (offers
              ?.products ?? [])
              .slice(0, 4)
              .map((product) => (
                <OffersCard key={String(product._id)} product={product} />
              ))}
      </div>
      <div className={styles.viewAllContainer}>
        <Link to="/offers" className={styles.viewAllBtn}>
          View All Offers
        </Link>
      </div>
    </section>
  );
}
