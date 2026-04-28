import type { productTemplate } from "../../services/mock/products.mock";
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
      {products.length === 0 && <p className={styles.noProducts}>No products found.</p>}
      {showDiscount
        ? products.map((product) => (
            <OffersCard key={product.id} product={product} />
          ))
        : products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
    </div>
  );
}
