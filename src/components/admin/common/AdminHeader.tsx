import styles from "./adminHeader.module.css";

interface Props {
  onAddClick: () => void;
  pageName: string;
}

export default function AdminHeader({ onAddClick, pageName }: Props) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{pageName}</h1>
        <p className={styles.subtitle}>
          Manage your store {pageName.toLowerCase()}
        </p>
      </div>

      <button className={styles.button} onClick={onAddClick}>
        + Add New {pageName}
      </button>
    </div>
  );
}
