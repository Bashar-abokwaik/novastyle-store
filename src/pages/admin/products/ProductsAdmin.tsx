import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { productsService } from "../../../services/productsService";

import styles from "./productsAdmin.module.css";
import AdminHeader from "../../../components/admin/common/AdminHeader";
import type { productTemplate } from "../../../types";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Toast from "../../../components/UI/Toast/Toast";
import ConfirmDialog from "../../../components/common/ConfirmDialog";

// Define the structure of the response received when fetching products for admin view
interface ProductsResponse {
  message: string;
  products: productTemplate[];
  total: number;
  page: number;
  pages: number;
}

export default function ProductsAdmin() {
  // Initialize the query client for managing and invalidating queries
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  // State and references for managing toast notifications, confirmation dialogs, and selected product ID for deletion
  const [selectedId, setSelectedId] = useState("");
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const confirmRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State to manage the current page for pagination
  const [page, setPage] = useState(1);
  const limit = 10;

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    toastRef.current?.showModal();
    setTimeout(() => {
      toastRef.current?.close();
    }, 2500);
  };

  // Use the useQuery hook from React Query to fetch the list of products for admin view. It handles loading, error, and success states.
  const { data: response, isLoading } = useQuery<ProductsResponse>({
    queryKey: ["products", page],
    queryFn: async (): Promise<ProductsResponse> =>
      (await productsService.getAllProductsAdmin(
        page,
        limit,
      )) as ProductsResponse,
  });

  // Extract the products array from the response, defaulting to an empty array if the response is undefined. This ensures that the component can safely render even if the data hasn't been fetched yet or if there are no products available.
  const products = response?.products ?? [];

  // Extract the total number of pages from the response, defaulting to 1 if the response is undefined. This is used for pagination controls in the UI.
  const totalPages = response?.pages ?? 1;

  // Handle navigation to the Add Product page when the "Add" button is clicked
  const handleAdd = () => {
    navigate("/admin/products/add");
  };

  // Handle navigation to the Edit Product page for a specific product when the "Edit" button is clicked
  const handleEdit = (id: string) => {
    navigate(`/admin/products/edit/${id}`);
  };

  // Handle the deletion of a product by setting the selected product ID and showing the confirmation dialog
  const handleDelete = (id: string) => {
    setSelectedId(id);
    confirmRef.current?.showModal();
  };

  // Handle the confirmation of product deletion. This function attempts to delete the selected product using the productsService. If successful, it shows a success toast message and invalidates the "products" query to refetch the updated list. If there's an error during deletion, it shows an error toast message.
  const handleConfirmDelete = async () => {
    // Check if a product ID is selected for deletion. If not, show an error toast message and return early.
    if (!selectedId) {
      setToastMessage("No product selected for deletion.");
      setToastType("error");
      showToast();
      return;
    }
    // Attempt to delete the selected product using the productsService. If successful, show a success toast message and invalidate the "products" query to refetch the updated list. If there's an error during deletion, show an error toast message.
    try {
      await productsService.deleteProduct(selectedId);
      setToastMessage("Product deleted successfully!");
      setToastType("success");
      showToast();
      // Invalidate the "products" query to refetch the updated list of products after deletion. This ensures that the UI reflects the latest state of the product list.
      queryClient.invalidateQueries({ queryKey: ["products"] });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Unknown error";
      setToastMessage(`Error deleting product: ${message}`);
      setToastType("error");
      showToast();
    }
  };

  console.log(page);
  return (
    <>
      <Toast ref={toastRef} type={toastType} message={toastMessage} />
      <ConfirmDialog
        ref={confirmRef}
        title="Confirm Deletion"
        message="Are you sure you want to delete this product?"
        onConfirm={handleConfirmDelete}
      />
      <AdminHeader onAddClick={handleAdd} pageName="Product" />
      <div className={styles.tableContainer}>
        {isLoading ? (
          <Spinner />
        ) : products.length === 0 ? (
          <p className={styles.noProducts}>No products found.</p>
        ) : null}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Product</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((product) => {
              const discountedPrice =
                (product.discount ?? 0) > 0
                  ? product.price -
                    (product.price * (product.discount ?? 0)) / 100
                  : product.price;

              return (
                <tr key={product._id}>
                  <td>
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className={styles.productImage}
                    />
                  </td>

                  <td>
                    <div className={styles.productInfo}>
                      <strong>{product.title}</strong>
                    </div>
                  </td>

                  <td>{product.categorySlug}</td>

                  <td>
                    {(product.discount ?? 0) > 0 ? (
                      <div className={styles.priceWrapper}>
                        <span className={styles.oldPrice}>
                          ${product.price}
                        </span>

                        <span className={styles.newPrice}>
                          ${discountedPrice.toFixed(2)}
                        </span>

                        <span className={styles.discountBadge}>
                          -{product.discount}%
                        </span>
                      </div>
                    ) : (
                      <span>${product.price}</span>
                    )}
                  </td>

                  <td>
                    {(product.stock ?? 0) > 0 ? (
                      <span className={styles.inStock}>{product.stock}</span>
                    ) : (
                      <span className={styles.outOfStock}>Out of Stock</span>
                    )}
                  </td>

                  <td>
                    <div className={styles.badges}>
                      {product.isFeatured && (
                        <span className={styles.featured}>Featured</span>
                      )}

                      {product.isNewArrival && (
                        <span className={styles.newArrival}>New</span>
                      )}
                    </div>
                  </td>

                  <td>
                    <div className={styles.actions}>
                      <button
                        className={styles.edit}
                        onClick={() => handleEdit(product._id)}
                      >
                        Edit
                      </button>

                      <button
                        className={styles.delete}
                        onClick={() => handleDelete(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button
            disabled={page === 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            Previous
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}
