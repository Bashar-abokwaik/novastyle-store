import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { collectionsService } from "../../../services/collectionsService";

import CollectionsPH from "../../UI/Placeholder/CollectionsPH";
import styles from "./collections.module.css";

import type { Collection } from "../../../types";

// Define the structure of the response expected from the collections API
interface CollectionsResponse {
  message: string;
  collections: Collection[];
}

export default function Collections() {
  // Use React Query to fetch collections data from the API
  const {
    data: collectionsResponse,
    error,
    isLoading,
  } = useQuery<CollectionsResponse, Error>({
    queryKey: ["collections"],
    queryFn: async (): Promise<CollectionsResponse> =>
      (await collectionsService.getAll()) as CollectionsResponse,
  });
  const navigate = useNavigate();

  // Handler for clicking on a collection card, navigates to the collection's page
  const onClickHandler = (slug: string) => {
    navigate(`/collections/${slug}`);
  };
  
  return (
    <section className={styles.section} id="collections">
      <h2>Collections</h2>
      <div className={styles.container}>
        {isLoading &&
          Array.from({ length: 2 }).map((_, i) => (
            <CollectionsPH key={i} className={styles.card} />
          ))}
        {!isLoading &&
          collectionsResponse?.collections?.map((col) => (
            <div
              key={String(col._id)}
              className={styles.card}
              onClick={() => onClickHandler(col.slug)}
            >
              <img src={col.imageUrl} alt={col.name} />
              <div className={styles.overlay}>
                <h3 className={styles.title}>{col.name}</h3>
              </div>
            </div>
          ))}
      </div>
      {error && <p>{error.message}</p>}
    </section>
  );
}
