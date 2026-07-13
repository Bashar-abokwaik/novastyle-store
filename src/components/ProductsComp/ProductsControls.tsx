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
  sort: string;
  setSort: (value: string) => void;
  categorySlug: string;
  mode?: "all" | "offers";
}

export default function ProductsControls({
  search,
  setSearch,
  sort,
  setSort,
  categorySlug,
  mode = "all",
}: ProductsControlsProps) {
  const { data: categories } = useQuery<categoryResponse, Error>({
    queryKey: ["categories"],
    queryFn: async (): Promise<categoryResponse> =>
      (await categoriesService.getAll()) as categoryResponse,
  });

  const navigate = useNavigate();

  const basePath = mode === "offers" ? "/offers" : "/products";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "") {
      navigate(basePath);
    } else {
      navigate(`${basePath}/category/${value}`);
    }
  };

  return (
    <div className={styles.controls}>
      {/* 🔍 Search */}
      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={styles.searchInput}
      />

      {/* 🔽 Sort */}
      <select
        value={sort}
        onChange={(e) => setSort(e.target.value)}
        className={styles.filterSelect}
      >
        <option value="">Sort By</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>

      {/* 🗂️ Category */}
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
