import { useQuery } from "@tanstack/react-query";
// import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./products.module.css";
import { categoriesService } from "../../services/categoriesService";

import type { Category } from "../../types";

interface categoryResponse {
  message: string;
  categories: Category[];
}

interface ProductsControlsProps {
  search: string;
  setSearch: (value: string) => void;
  priceSort: string;
  setPriceSort: (value: string) => void;
  nameSort: string;
  setNameSort: (value: string) => void;
  categorySlug: string;
  mode?: "all" | "offers";
  resetPage?: () => void; // Optional function to reset the page number
}

export default function ProductsControls({
  search,
  setSearch,
  priceSort,
  setPriceSort,
  nameSort,
  setNameSort,
  categorySlug,
  mode = "all",
  resetPage,
}: ProductsControlsProps) {
  const navigate = useNavigate();

  // Fetch categories using React Query to populate the category filter dropdown. The query is keyed by "categories" and fetches all categories from the categoriesService.
  const { data: categories } = useQuery<categoryResponse, Error>({
    queryKey: ["categories"],
    queryFn: async (): Promise<categoryResponse> =>
      (await categoriesService.getAll()) as categoryResponse,
  });

  const basePath = mode === "offers" ? "/offers" : "/products";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    resetPage?.(); // Call resetPage if it's provided

    if (value === "") {
      navigate(basePath);
    } else {
      navigate(`${basePath}/category/${value}`);
    }
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>, sortType: "price" | "name") => {
    const value = e.target.value;
    if (sortType === "price") {
      setPriceSort(value);
    } else if (sortType === "name") {
      setNameSort(value);
    }
    resetPage?.(); // Reset the page number to 1 when sort changes
  };


  return (
    <div className={styles.controls}>
      {/* Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {/* Sort by price */}
      <select
        value={priceSort}
        onChange={(e) => handleSortChange(e, "price")}
        className={styles.filterSelect}
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {/* Sort by Name */}
      <select
        value={nameSort}
        onChange={(e) => handleSortChange(e, "name")}
        className={styles.filterSelect}
      >
        <option value="">Sort By Name</option>
        <option value="name-asc">Name: A to Z</option>
        <option value="name-desc">Name: Z to A</option>
      </select>

      {/* Category */}
      <select
        value={categorySlug}
        onChange={handleCategoryChange}
        className={styles.filterSelect}
      >
        <option value="">All Categories</option>
        {categories?.categories.map((category) => (
          <option key={String(category._id)} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}
