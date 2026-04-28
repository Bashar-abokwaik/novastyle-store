import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./products.module.css";
import { categoriesService } from "../../services/categoriesService";

import type { categoryTemplate } from "../../services/mock/categories.mock";

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
  const [categories, setCategories] = useState<categoryTemplate[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await categoriesService.getAll();
        setCategories(data as categoryTemplate[]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCategories();
  }, []);

  const basePath = mode === "offers" ? "/offers/category" : "/products/category";

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;

    if (value === "") {
      navigate(basePath);
    } else {
      navigate(`${basePath}/${value}`);
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
        {categories.map((category) => (
          <option key={category.id} value={category.slug}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}