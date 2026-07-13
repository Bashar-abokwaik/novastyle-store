import styles from "./spinner.module.css";

// Spinner component that displays a loading spinner
// The spinner is styled using CSS classes defined in the spinner.module.css file.

export default function Spinner() {
  return (
    <div className={styles.spinnerContainer}>
      <div className={styles.spinner}></div>
    </div>
  );
}