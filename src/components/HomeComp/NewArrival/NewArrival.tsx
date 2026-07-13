import { useQuery } from "@tanstack/react-query";
import NewArrivalCard from "./NewArrivalCard";
import Placeholder from "../../UI/Placeholder/Placeholder";

import type { productTemplate } from "../../../types";
import { productsService } from "../../../services/productsService";

import styles from "./newArrival.module.css";
import { Link } from "react-router";

// Define the structure of the response expected from the new arrivals API
interface NewArrivalsResponse {
  message: string;
  products: productTemplate[];
}

export default function NewArrival() {
  // Use React Query to fetch new arrivals data from the API
  const {
    data: newArrivals,
    error,
    isLoading,
  } = useQuery<NewArrivalsResponse, Error>({
    queryKey: ["newArrivals"],
    queryFn: async (): Promise<NewArrivalsResponse> =>
      (await productsService.getNewArrivals()) as NewArrivalsResponse,
  });

  return (
    <section className={styles.section} id="NewArrivals">
      {error && <p>{error.message}</p>}
      <h2 className={styles.sectionTitle}>New Arrivals</h2>
      <div className={styles.newArrivalsContainer}>
        {isLoading &&
          Array.from({ length: 6 }).map((_, i) => <Placeholder key={i} />)}
        {!isLoading &&
          newArrivals?.products?.map((product) => (
            <NewArrivalCard key={product._id as string | number} product={product} />
          ))}
      </div>
      <div className={styles.viewAllContainer}>
        <Link to="/products" className={styles.viewAllBtn}>
          View All Products
        </Link>
      </div>
    </section>
  );
}
