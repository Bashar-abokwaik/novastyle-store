import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { productsService } from "../../services/productsService";

import type { productTemplate } from "../../types/index";

import ProductsControls from "../../components/ProductsComp/ProductsControls";
import ProductsList from "../../components/ProductsComp/ProductsList";
import Spinner from "../../components/UI/Spinner/Spinner";

import styles from "../../components/ProductsComp/products.module.css";

// ProductsProps interface defines the props that can be passed to the Products component, including an optional mode that can be either "all" or "offers".
interface ProductsProps {
  mode?: "all" | "offers";
}

// ProductsResponse interface defines the structure of the response received when fetching products, including a message and an array of productTemplate objects.
interface ProductsResponse {
  message: string;
  products: productTemplate[];
  total: number;
  page: number;
  pages: number;
}

// Products component fetches and displays products based on the specified mode ("all" or "offers") and allows filtering and sorting of the products.
function Products({ mode = "all" }: ProductsProps) {
  // Extract the 'slug' parameter from the URL to filter products by category if provided.
  const { slug } = useParams<{ slug: string }>();

  // State to manage the current page for pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // State variables to manage search and sort functionality for the products list.
  const [search, setSearch] = useState("");
  const [priceSort, setPriceSort] = useState("");
  const [nameSort, setNameSort] = useState("");

  const sort = priceSort || nameSort;

  // Use the useQuery hook from React Query to fetch products based on the specified mode. It handles loading, error, and success states.
  const { data, error, isLoading } = useQuery<ProductsResponse, Error>({
    queryKey: ["products", mode, slug, page, limit, sort],
    queryFn: async (): Promise<ProductsResponse> => {
      if (mode === "offers" && slug) {
        return (await productsService.getByCategoryOffers(
          slug,
          page,
          limit,
          sort,
        )) as ProductsResponse;
      }
      if (slug) {
        return (await productsService.getByCategory(
          slug,
          page,
          limit,
          sort,
        )) as ProductsResponse;
      }

      return mode === "offers"
        ? ((await productsService.getOffers(
            page,
            limit,
            sort,
          )) as ProductsResponse)
        : ((await productsService.getAll(
            page,
            limit,
            sort,
          )) as ProductsResponse);
    },
  });

  const products = data?.products || [];
  let filtered = [...(products || [])]; // Create a copy of the products array to apply filters and sorting without mutating the original data.
  const categorySlug = slug || "";

  // Extract the total number of pages from the response, defaulting to 1 if the response is undefined. This is used for pagination controls in the UI.
  const totalPages = data?.pages ?? 1;

  // search filter
  if (search) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  return (
    <div className={styles.products}>
      <ProductsControls
        search={search}
        setSearch={setSearch}
        priceSort={priceSort}
        setPriceSort={setPriceSort}
        nameSort={nameSort}
        setNameSort={setNameSort}
        categorySlug={categorySlug}
        mode={mode}
        resetPage={() => setPage(1)} // Pass a function to reset the page number to 1 when search or sort changes
      />

      {isLoading && <Spinner />}
      {error && <p>Error: {error.message}</p>}

      <ProductsList products={filtered} />
      <div className={styles.pagination}>
        <button
          disabled={page === 1}
          onClick={() => setPage((prev) => prev - 1)}
        >
          Previous
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          disabled={page === totalPages}
          onClick={() => setPage((prev) => prev + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Products;
