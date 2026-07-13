import styles from "./AdminCategoriesCart.module.css";
import type { Category } from "../../../types";

// Define the AdminCategoriesCart component, which displays a category's image, name, and action buttons for editing and deleting the category.
export default function AdminCategoriesCart({
  category,
  onEdit,
  onDelete,
}: {
  category: Category;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={category.imageUrl}
          alt={category.name}
          className={styles.image}
        />
      </div>
      <h2 className={styles.name}>{category.name}</h2>
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => onEdit(category._id)}>
          Edit
        </button>
        <button
          className={styles.delete}
          onClick={() => onDelete(category._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
