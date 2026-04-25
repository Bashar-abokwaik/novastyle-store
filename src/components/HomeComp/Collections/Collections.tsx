import { collections } from "../../../services/mock/collections.mock";
import { useNavigate } from "react-router-dom";

import styles from "./collections.module.css";

export default function Collections() {
  const navigate = useNavigate();

  return (
    <section className={styles.section} id="collections">
      <h2>Collections</h2>

      <div className={styles.grid}>
        {collections.map((col) => (
          <div
            key={col.id}
            className={styles.card}
            onClick={() => navigate(`/collections/${col.slug}`)}
          >
            <img src={col.image} alt={col.title} />
            <div className={styles.overlay}>
              <h3 className={styles.title}>{col.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}