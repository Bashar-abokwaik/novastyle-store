import type { productTemplate } from "../../types";
import ProductCard from "./ProductCard";
import styles from "./products.module.css";

// ProductsListProps interface defines the props that can be passed to the ProductsList component, including an array of products and a mode that can be either "all" or "offers".
interface ProductsListProps {
  products: productTemplate[];
}

// ProductsList component renders a list of products based on the provided mode ("all" or "offers"). It displays either the OffersCard or ProductCard component for each product, depending on the mode and whether the product has a discount.
export default function ProductsList({ products }: ProductsListProps) {
  return (
    <div className={styles.productsList}>
      {products.length === 0 && (
        <p className={styles.noProducts}>No products found.</p>
      )}

      {products.map((product) => (
        <ProductCard key={product._id as React.Key} product={product} />
      ))}
    </div>
  );
}
