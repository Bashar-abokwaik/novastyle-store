import type { productTemplate } from "../../types/index";
import OffersCard from "../HomeComp/Offers/OffersCard";
import ProductCard from "./ProductCard";
import styles from "./products.module.css";

export default function ProductsList({
  products,
  showDiscount,
}: {
  products: productTemplate[];
  showDiscount: boolean;
}) {
  return (
    <div className={styles.productsList}>
      {products.length === 0 && (
        <p className={styles.noProducts}>No products found.</p>
      )}
      {showDiscount &&
        products.map((product) => (
          <OffersCard key={product._id as React.Key} product={product} />
        ))}
      {!showDiscount &&
        products.map((product) => (
          <ProductCard key={product._id as React.Key} product={product} />
        ))}
    </div>
  );
}
