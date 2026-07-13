import styles from "./placeholder.module.css";

// Placeholder component for cards while data is loading
export default function Placeholder({
  hasActions = 2, // Default to 2 actions if not specified
}: {
  hasActions?: number;
}) {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.imageWrapper}>
        <div className="placeholder w-100 h-100 bg-secondary bg-opacity-50"></div>
      </div>

      <div className={styles.cardBody}>
        <div className="placeholder-glow">
          <span className="placeholder col-8"></span>
        </div>

        <div className="placeholder-glow">
          <span className="placeholder col-5"></span>
        </div>

        <div className={styles.actions}>
          {hasActions === 2 && (
            <>
              <span className="placeholder col-5 btn btn-secondary disabled"></span>
              <span className="placeholder col-5 btn btn-secondary disabled"></span>
            </>
          )}

          {hasActions === 1 && (
            <span className="placeholder col-6 btn btn-secondary disabled"></span>
          )}
        </div>
      </div>
    </div>
  );
}
