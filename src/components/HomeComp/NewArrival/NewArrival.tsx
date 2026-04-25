import { useEffect, useState } from "react";

import NewArrivalCard from "./NewArrivalCard";

import type { productTemplate } from "../../../services/mock/products.mock";
import { productsService } from "../../../services/productsService";

import styles from "./newArrival.module.css";
import { Link } from "react-router";

export default function NewArrival() {
  const [newArrivals, setNewArrivals] = useState<productTemplate[]>([]);

  const fetchNewArrivals = async () => {
    try {
      const data = await productsService.getNewArrivals();
      setNewArrivals(data as productTemplate[]);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchNewArrivals();
  }, []);

  return (
    <div className={styles.section} id="NewArrivals">
      <h2 className={styles.sectionTitle}>New Arrivals</h2>
      <div className={styles.newArrivalsContainer}>
        {newArrivals.map((product) => (
          <NewArrivalCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.viewAllContainer}>
        <Link to="/products" className={styles.viewAllBtn}>
          View All Products
        </Link>
      </div>
    </div>
  );
}
