import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { productsService } from "../../services/productsService";

import ProductCard from "../../components/ProductsComp/ProductCard";

import styles from "./collections.module.css";
import type { productTemplate } from "../../types";

import Spinner from "../../components/UI/Spinner/Spinner";

interface ProductsResponse {
  message: string;
  products: productTemplate[];
}

// CollectionsPage component fetches and displays products based on the collection slug from the URL parameters.
export default function CollectionsPage() {
  // Extract the 'slug' parameter from the URL to identify the specific collection.
  const { slug } = useParams<{ slug: string }>();
  // Use the useQuery hook from React Query to fetch products for the specified collection. It handles loading, error, and success states.
  const {
    data: products,
    error,
    isLoading,
  } = useQuery<ProductsResponse, Error>({
    queryKey: ["products", slug],
    queryFn: async (): Promise<ProductsResponse> =>
      (await productsService.getByCollection(slug!)) as ProductsResponse,
    enabled: !!slug,
  });

  return (
    <section className={styles.section}>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          <div className={styles.banner}>
            <h2 className={styles.title}>{slug?.toUpperCase()}</h2>
          </div>
          <div className={styles.container}>
            {products && products.products.length > 0 ? (
              products.products.map((prod) => (
                <ProductCard key={prod.id as number} product={prod} />
              ))
            ) : (
              <p className={styles.empty}>No products found</p>
            )}
          </div>
          {error && <p>{error.message}</p>}
        </>
      )}
    </section>
  );
}
