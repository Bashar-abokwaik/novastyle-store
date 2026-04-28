import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import type { productTemplate } from "../../../services/mock/products.mock";

import { productsService } from "../../../services/productsService";

import styles from "./offers.module.css";
import OffersCard from "./OffersCard";

export default function Offers() {
  const [offers, setOffers] = useState<productTemplate[]>([]);

  const fetchOffers = async () => {
    try {
      const data = await productsService.getDiscounted();
      setOffers(data as productTemplate[]);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchOffers();
  }, []);
  return (
    <div className={styles.offers} id="offers">
      <h2 className={styles.sectionTitle}>Special Offers</h2>
      <div className={styles.offersContainer}>
        {offers.slice(0, 4).map((product) => (
          <OffersCard key={product.id} product={product} />
        ))}
      </div>
      <div className={styles.viewAllContainer}>
        <Link to="/offers" className={styles.viewAllBtn}>
          View All Offers
        </Link>
      </div>
    </div>
  );
}
