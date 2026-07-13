import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useParams } from "react-router-dom";

import { productsService } from "../../services/productsService";
import { getDiscountedPrice } from "../../utils/discountedPrice";

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
}

// Products component fetches and displays products based on the specified mode ("all" or "offers") and allows filtering and sorting of the products.
function Products({ mode = "all" }: ProductsProps) {
  // Extract the 'slug' parameter from the URL to filter products by category if provided.
  const { slug } = useParams<{ slug: string }>();

  // Use the useQuery hook from React Query to fetch products based on the specified mode. It handles loading, error, and success states.
  const { data, error, isLoading } = useQuery<ProductsResponse, Error>({
    queryKey: ["products", mode],
    queryFn: async (): Promise<ProductsResponse> =>
      mode === "offers"
        ? ((await productsService.getOffers()) as ProductsResponse)
        : ((await productsService.getAll()) as ProductsResponse),
  });

  // State variables to manage search and sort functionality for the products list.
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("");

  
  const products = data?.products || [];
  let filtered = [...(products || [])]; // Create a copy of the products array to apply filters and sorting without mutating the original data.
  const categorySlug = slug || "";


  // Filter products based on the specified mode. If the mode is "offers", only include products with a discount greater than 0. If the mode is "all", exclude products with a discount of 0 or no discount.
  if (mode === "all"){
    filtered = filtered.filter((p) => !p.discount || p.discount === 0);
  }

  // search filter
  if (search) {
    filtered = filtered.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase()),
    );
  }

  // sort
  const discountedPrice = (p: productTemplate) =>
    getDiscountedPrice(p.price, p.discount || 0);

  // Sort products based on the selected sort option. If the mode is "offers", sort by discounted price. If the mode is "all", sort by regular price. The sorting can be either ascending or descending based on the selected option.
  if (mode === "offers") {
    if (sort === "price-asc") {
      filtered.sort((a, b) => discountedPrice(a) - discountedPrice(b));
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => discountedPrice(b) - discountedPrice(a));
    }
  } else {
    if (sort === "price-asc") {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sort === "price-desc") {
      filtered.sort((a, b) => b.price - a.price);
    }
  }

  // Filter products by category if a category slug is provided
  if (categorySlug) {
    filtered = filtered.filter((p) => p.categorySlug === categorySlug);
  }

  return (
    <div className={styles.products}>
      <ProductsControls
        search={search}
        setSearch={setSearch}
        sort={sort}
        setSort={setSort}
        categorySlug={categorySlug}
        mode={mode}
      />

      {isLoading && <Spinner />}
      {error && <p>Error: {error.message}</p>}

      <ProductsList products={filtered} showDiscount={mode === "offers"} />
    </div>
  );
}

export default Products;
