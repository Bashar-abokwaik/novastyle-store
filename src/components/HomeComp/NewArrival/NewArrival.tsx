import { useInfiniteQuery } from "@tanstack/react-query";
import Button from "../../UI/Buttons/Button";
import NewArrivalCard from "./NewArrivalCard";
import Placeholder from "../../UI/Placeholder/Placeholder";

import type { productTemplate } from "../../../types";
import { productsService } from "../../../services/productsService";

import styles from "./newArrival.module.css";

// Define the structure of the response expected from the new arrivals API
interface NewArrivalsResponse {
  message: string;
  products: productTemplate[];
  total: number;
  page: number;
  pages: number;
}

export default function NewArrival() {
  // Use React Query to fetch new arrivals data from the API
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    useInfiniteQuery({
      queryKey: ["newArrivals"],

      initialPageParam: 1,

      queryFn: async ({ pageParam }): Promise<NewArrivalsResponse> =>
        productsService.getNewArrivals(pageParam, 8) as Promise<NewArrivalsResponse>,

      getNextPageParam: (lastPage: NewArrivalsResponse) =>
        lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    });

  const products = data?.pages.flatMap((page) => page.products) ?? [];

  return (
    <section className={styles.section} id="NewArrivals">
      {isLoading && <p>Loading...</p>}
      <h2 className={styles.sectionTitle}>New Arrivals</h2>
      <div className={styles.newArrivalsContainer}>
        {isLoading &&
          Array.from({ length: 8 }).map((_, i) => <Placeholder key={i} />)}
        {!isLoading &&
          products.map((product) => (
            <NewArrivalCard
              key={product._id as string | number}
              product={product}
            />
          ))}
      </div>
      {hasNextPage && (
        <div className={styles.loadMore}>
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "View More"}
          </Button>
        </div>
      )}
    </section>
  );
}
