import { Link } from "react-router-dom";

import type { Category } from "../../../types";


import styles from "./categories.module.css";

// Define the CategoryCard component, which displays a category's image and name, and links to the products page for that category.
export default function CategoryCard({
  category,
}: {
  category: Category;
}) {
  return (
    <Link to={`/products/category/${category.slug}`} className={styles.categoryLink}>
      <div className={styles.categoryCard}>
        <img
          src={category.imageUrl}
          className={styles.cardImgTop}
          alt={category.name}
        />
        <div className={styles.cardBody}>
          <h5 className={styles.cardTitle}>{category.name}</h5>
        </div>
      </div>
    </Link>
  );
}
