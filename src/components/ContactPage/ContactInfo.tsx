import styles from "./contact.module.css";

export default function ContactInfo() {
  return (
    <div className={styles.contactInfo}>
      <h2 className={styles.infoTitle}>Get in Touch</h2>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Email</span>
        <span className={styles.infoValue}>support@store.com</span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Phone</span>
        <span className={styles.infoValue}>+962 7XX XXX XXX</span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Response Time</span>
        <span className={styles.infoValue}>Within 24 hours</span>
      </div>

      <div className={styles.infoItem}>
        <span className={styles.infoLabel}>Location</span>
        <span className={styles.infoValue}>Jordan</span>
      </div>
    </div>
  );
}