import { useRef, useState, useEffect } from "react";
import { useNavigate, useParams, type Params } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Toast from "../../../components/UI/Toast/Toast";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { collectionsService } from "../../../services/collectionsService";

import styles from "./collection.module.css";

// Define the structure of the data returned from the collections API, which includes a message and a collection object containing name, slug, and imageUrl.
interface CollectionResponse {
  message: string;
  collection: {
    name: string;
    slug: string;
    imageUrl: string;
  };
}

export default function EditCollection(): React.JSX.Element {
  const navigate = useNavigate();
  const params = useParams() as Params<string>;// Get the collectionId from the URL parameters using useParams hook

  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State variables to hold the collection name and image URL for editing
  const [name, setName] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  // Use react-query to fetch the collection details by ID. The query is enabled only if the collectionId is present in the URL parameters. The fetched data is used to populate the form fields for editing.
  const { data, isLoading, error } = useQuery({
    queryKey: ["collection", params.collectionId],
    queryFn: async () => {
      const response = await collectionsService.getById(params.collectionId!);
      const { collection } = response as CollectionResponse;
      return collection;
    },
    enabled: !!params.collectionId,
  });

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Use useEffect to update the form fields with the fetched collection data when it becomes available. This ensures that the form is pre-filled with the current collection details for editing.
  useEffect(() => {
    if (!data) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(data.name);
    setImageUrl(data.imageUrl);
  }, [data]);

  // Handle form submission for updating the collection details. It prevents the default form submission behavior, generates a slug from the name, and calls the collectionsService to update the collection. On success, it shows a success toast message and navigates back to the collections list after a short delay. On error, it shows an error toast message.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      await collectionsService.updateCollection(
        params.collectionId!,
        name,
        slug,
        imageUrl,
      );

      setToastMessage("Collection updated successfully");
      setToastType("success");
      showToast();

      setTimeout(() => {
        navigate("/admin/collections");
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update collection";

      setToastMessage(errorMessage);
      setToastType("error");
      showToast();
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  if (error) {
    return <p>Error: {(error as Error).message}</p>;
  }

  return (
    <>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />

      <div className={styles.formContainer}>
        <h1 className={styles.title}>Edit Collection</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Collection Name</label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter collection name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="imageUrl">Image URL</label>

            <input
              type="text"
              id="imageUrl"
              name="imageUrl"
              placeholder="https://..."
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Update Collection
          </button>
        </form>
      </div>
    </>
  );
}
