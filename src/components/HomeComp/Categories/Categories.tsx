import { useQuery } from "@tanstack/react-query";
import { categoriesService } from "../../../services/categoriesService";

import CategoryCard from "./CategoryCard";
import CategoryPH from "../../UI/Placeholder/CategoryPH";
import styles from "./categories.module.css";
import type { Category } from "../../../types";

// Define the structure of the response expected from the categories API
interface CategoryResponse {
  message: string;
  categories: Category[];
}

export default function Categories() {
  // Use React Query to fetch categories data from the API
  const {
    data: categoriesResponse,
    error,
    isLoading,
  } = useQuery<CategoryResponse, Error>({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryResponse> =>
      (await categoriesService.getAll()) as CategoryResponse,
  });

  return (
    <section className={styles.categories}>
      <h2 className={styles.categoriesTitle}>Categories</h2>
      {error && <p>{error.message}</p>}
      <div className={styles.categoriesContainer}>
        {isLoading &&
          Array.from({ length: 7 }).map((_, i) => (
            <CategoryPH key={`placeholder-${i}`} />
          ))}
        {!isLoading &&
          categoriesResponse?.categories?.map((category) => (
            <CategoryCard key={category._id as React.Key} category={category} />
          ))}
      </div>
    </section>
  );
}
