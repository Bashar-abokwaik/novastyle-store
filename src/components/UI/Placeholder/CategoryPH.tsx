import styles from "./placeholder.module.css";

// Placeholder component for category cards while data is loading
export default function CategoryPH() {
  return (
    <div className={styles.categoryCard} aria-hidden="true">
      <div className={styles.categoryImageWrapper}>
        <div className="placeholder rounded-circle w-100 h-100 bg-secondary bg-opacity-25 placeholder-glow"></div>
      </div>
    </div>
  );
}
