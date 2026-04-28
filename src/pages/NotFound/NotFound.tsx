import styles from "./notFound.module.css";

function NotFound() {
  return <div className={styles.notFound}>
    <h1>404 - Page Not Found</h1>
    <p>Sorry, the page you are looking for does not exist.</p>
  </div>;
}

export default NotFound;

