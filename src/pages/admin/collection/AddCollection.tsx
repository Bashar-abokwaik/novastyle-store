import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Toast from "../../../components/UI/Toast/Toast";
import { collectionsService } from "../../../services/collectionsService";

import styles from "./collection.module.css";

export default function AddCollection(): React.JSX.Element {
  const navigate = useNavigate();

  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Handle form submission for adding a new collection
  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const name = formData.get("name") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const slug = name.toLowerCase().trim().replace(/\s+/g, "-");

    try {
      const form = e.currentTarget;
      await collectionsService.createCollection(name, slug, imageUrl);

      setToastMessage("Collection created successfully");
      setToastType("success");
      showToast();

      form.reset();

      // Navigate to the collections list page after a short delay to allow the user to see the success message
      setTimeout(() => {
        navigate("/admin/collections");
      }, 1500);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create collection";
      setToastMessage(errorMessage);
      setToastType("error");
      showToast();
    }
  };

  return (
    <>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />

      <div className={styles.formContainer}>
        <h1 className={styles.title}>Add New Collection</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Collection Name</label>

            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter collection name"
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
              required
            />
          </div>

          <button type="submit" className={styles.submitButton}>
            Add Collection
          </button>
        </form>
      </div>
    </>
  );
}
