import { useEffect, useState } from "react";
import { categoriesService } from "../../../services/categoriesService";

import CategoryCard from "./CategoryCard";
import styles from "./categories.module.css";

import type { categoryTemplate } from "../../../services/mock/categories.mock";

export default function Categories() {
  const [categories, setCategories] = useState<categoryTemplate[]>([]);

  const fetchCategories = async () => {
    try {
      const data = await categoriesService.getAll();
      setCategories(data as categoryTemplate[]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchCategories();
  }, []);

  return (
    <div className={styles.categories}>
      <h2 className={styles.categoriesTitle}>Categories</h2>

      <div className={styles.categoriesContainer}>
        {categories.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>
    </div>
  );
}