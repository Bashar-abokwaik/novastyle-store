import styles from "./AdminCollectionsCart.module.css";
import type { Collection } from "../../../types";

// Define the AdminCollectionsCart component, which displays a collection's image, name, and action buttons for editing and deleting the collection.
export default function AdminCollectionsCart({
  collection,
  onEdit,
  onDelete,
}: {
  collection: Collection;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}): React.JSX.Element {
  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img
          src={collection.imageUrl}
          alt={collection.name}
          className={styles.image}
        />
      </div>
      <h2 className={styles.name}>{collection.name}</h2>
      <div className={styles.actions}>
        <button className={styles.edit} onClick={() => onEdit(collection._id)}>
          Edit
        </button>
        <button
          className={styles.delete}
          onClick={() => onDelete(collection._id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}
