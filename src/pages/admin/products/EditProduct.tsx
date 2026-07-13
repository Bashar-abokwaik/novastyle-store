import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { useRef, useState } from "react";

import { categoriesService } from "../../../services/categoriesService";
import { collectionsService } from "../../../services/collectionsService";
import { productsService } from "../../../services/productsService";

import type { Category, Collection, productTemplate } from "../../../types";

import Toast from "../../../components/UI/Toast/Toast";
import Spinner from "../../../components/UI/Spinner/Spinner";

import styles from "./productsAdmin.module.css";

// Define the structure of the response received when fetching categories, collections, and product details
interface CategoriesResponse {
  message: string;
  categories: Category[];
}

interface CollectionsResponse {
  message: string;
  collections: Collection[];
}

interface ProductResponse {
  message: string;
  product: productTemplate;
}

export default function EditProduct(): React.JSX.Element {
  const navigate = useNavigate();
  // Get the productId from the URL parameters using useParams hook
  const { productId } = useParams();
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
  
  // Fetch product details using react-query
  const { data: product, isLoading: isProductLoading } = useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductResponse> => {
      console.log("Fetching product:", productId);

      const response = await productsService.getById(productId!);

      console.log("Response:", response);

      return response as ProductResponse;
    },
    enabled: !!productId,
  });

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    toastRef.current?.showModal();

    setTimeout(() => {
      toastRef.current?.close();
    }, 2500);
  };

  // handleSubmit function is called when the form is submitted. It gathers the form data, sends an update request to the server, and handles success or error responses.
  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    // Validate that all required fields are filled in before attempting to update the product. If any field is empty, show an error toast message and return early.
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
    // Attempt to update the product using the productsService. If successful, show a success toast message and navigate back to the products list. If there's an error, show an error toast message.
    try {
      const form = e.currentTarget;
      await productsService.updateProduct(productId!, {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        price: formData.get("price") as string,
        imageUrl: formData.get("imageUrl") as string,
        categoryId: formData.get("categoryId") as string,
        categorySlug: categories?.categories.find((category) => category._id === formData.get("categoryId"))?.slug || "",
        collectionId: (formData.get("collectionId") as string) || undefined,
        collectionSlug: collections?.collections.find((collection) => collection._id === formData.get("collectionId"))?.slug || "",
        stock: formData.get("stock") as string,
        costPrice: formData.get("costPrice") as string,
        discount: (formData.get("discount") as string) || "0",
        isFeatured: formData.get("isFeatured") === "on",
        isNewArrival: formData.get("isNewArrival") === "on",
      });

      setToastMessage("Product updated successfully");
      setToastType("success");
      showToast();
      form.reset();

      // Navigate back to the products list after a short delay to allow the user to see the success message.
      setTimeout(() => {
        navigate("/admin/products");
      }, 1000);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to update product";

      setToastMessage(errorMessage);
      setToastType("error");

      showToast();
    }
  };

  if (!product || isProductLoading) {
    return <Spinner />;
  }



  return (
    <>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />

      <div className={styles.formContainer}>
        <h1 className={styles.pageTitle}>Edit Product</h1>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.grid}>
            <div className={styles.formGroup}>
              <label>Title</label>
              <input
                name="title"
                defaultValue={product?.product.title}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                type="number"
                name="price"
                defaultValue={product?.product.price}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Cost Price</label>
              <input
                type="number"
                name="costPrice"
                defaultValue={product?.product.costPrice}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Stock</label>
              <input
                type="number"
                name="stock"
                defaultValue={product?.product.stock}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label>Discount %</label>
              <input
                type="number"
                min="0"
                max="100"
                name="discount"
                defaultValue={product?.product.discount}
              />
            </div>

            <div className={styles.formGroup}>
              <label>Image URL</label>
              <input name="imageUrl" defaultValue={product?.product.imageUrl} />
            </div>

            <div className={styles.formGroup}>
              <label>Category</label>

              <select
                name="categoryId"
                defaultValue={product?.product.categoryId}
                required
              >
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

              <select
                name="collectionId"
                defaultValue={product?.product.collectionId || ""}
              >
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

            <textarea
              rows={5}
              name="description"
              defaultValue={product?.product.description}
              required
            />
          </div>

          <div className={styles.checkboxes}>
            <label>
              <input
                type="checkbox"
                name="isFeatured"
                defaultChecked={product?.product.isFeatured}
              />
              Featured Product
            </label>

            <label>
              <input
                type="checkbox"
                name="isNewArrival"
                defaultChecked={product?.product.isNewArrival}
              />
              New Arrival
            </label>
          </div>

          <button type="submit" className={styles.submitButton}>
            Save Changes
          </button>
        </form>
      </div>
    </>
  );
}
