import styles from "./placeholder.module.css";

// Placeholder component for collections while data is loading
export default function CollectionsPH({ className = "" }) {
  return <div className={`${styles.placeholder} ${className}`} />;
}
