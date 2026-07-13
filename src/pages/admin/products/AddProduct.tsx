import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useRef, useState } from "react";

import { categoriesService } from "../../../services/categoriesService";
import { collectionsService } from "../../../services/collectionsService";
import { productsService } from "../../../services/productsService";

import type { Category, Collection } from "../../../types";

import Toast from "../../../components/UI/Toast/Toast";

import styles from "./productsAdmin.module.css";

// Define the structure of the response received when fetching categories and collections
interface CategoriesResponse {
  message: string;
  categories: Category[];
}

interface CollectionsResponse {
  message: string;
  collections: Collection[];
}

export default function AddProduct(): React.JSX.Element {
  const navigate = useNavigate();

  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;

  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // Fetch categories using react-query
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoriesResponse> => {
      const response = await categoriesService.getAll();
      return response as CategoriesResponse;
    },
  });

  // Fetch collections using react-query
  const { data: collections } = useQuery({
    queryKey: ["collections"],
    queryFn: async (): Promise<CollectionsResponse> => {
      const response = await collectionsService.getAll();
      return response as CollectionsResponse;
    },
  });

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    toastRef.current?.showModal();

    setTimeout(() => {
      toastRef.current?.close();
    }, 2500);
  };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Validate that all required fields are filled in before attempting to create the product. If any field is empty, show an error toast message and return early.
    if (
      !formData.get("title") ||
      !formData.get("description") ||
      !formData.get("price") ||
      !formData.get("imageUrl") ||
      !formData.get("categoryId") ||
      !formData.get("stock") ||
      !formData.get("costPrice")
    ) {
      setToastMessage("Please fill in all required fields.");
      setToastType("error");
      showToast();
      return;
    }

    // Attempt to create the product using the productsService. If successful, show a success toast message and navigate back to the products list. If there's an error, show an error toast message.
    try {
        const form = e.currentTarget;
      await productsService.createProduct({
        title: formData.get("title"),
        description: formData.get("description"),
        price: formData.get("price"),
        imageUrl: formData.get("imageUrl"),
        categoryId: formData.get("categoryId"),
        categorySlug: categories?.categories.find((category) => category._id === formData.get("categoryId"))?.slug,
        collectionId: formData.get("collectionId") || undefined,
        collectionSlug: collections?.collections.find((collection) => collection._id === formData.get("collectionId"))?.slug,
        stock: formData.get("stock"),
        costPrice: formData.get("costPrice"),
        discount: formData.get("discount") || 0,
        isFeatured: formData.get("isFeatured") === "on",
        isNewArrival: formData.get("isNewArrival") === "on",
      });

      setToastMessage("Product created successfully");
      setToastType("success");
      showToast();
      form.reset();

      // Navigate back to the products list after a short delay to allow the user to see the success message.
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to create product";

      setToastMessage(errorMessage);
      setToastType("error");

      showToast();
    }
  };

  return (
    <>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />

      <div className={styles.formContainer}>
        <h1 className={styles.pageTitle}>Add Product</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input name="title" required />
            </div>

            <div className={styles.formGroup}>
              <label>Price</label>
              <input type="number" name="price" required />
            </div>

            <div className={styles.formGroup}>
              <label>Cost Price</label>
              <input type="number" name="costPrice" required />
            </div>

            <div className={styles.formGroup}>
              <label>Stock</label>
              <input type="number" name="stock" required />
            </div>

            <div className={styles.formGroup}>
              <label>Discount %</label>
              <input type="number" min="0" max="100" name="discount" />
            </div>

            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input name="imageUrl" />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>

              <select name="categoryId" required>
                <option value="">Select Category</option>

                {categories?.categories?.map((category: Category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Collection</label>

              <select name="collectionId">
                <option value="">No Collection</option>

                {collections?.collections?.map((collection: Collection) => (
                  <option key={collection._id} value={collection._id}>
                    {collection.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>

            <textarea rows={5} name="description" required />
          </div>

          <div className={styles.checkboxes}>
            <label>
              <input type="checkbox" name="isFeatured" />
              Featured Product
            </label>

            <label>
              <input type="checkbox" name="isNewArrival" />
              New Arrival
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Create Product
          </button>
        </form>
      </div>
    </>
  );
}
