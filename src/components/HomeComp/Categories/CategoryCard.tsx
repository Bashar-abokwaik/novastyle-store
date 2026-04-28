import { Link } from "react-router-dom";

import type { categoryTemplate } from "../../../services/mock/categories.mock";

import styles from "./categories.module.css";

export default function CategoryCard({
  category,
}: {
  category: categoryTemplate;
}) {
  return (
    <Link to={`/products/category/${category.slug}`} className={styles.categoryLink}>
      <div className={styles.categoryCard}>
        <img
          src={category.image}
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
