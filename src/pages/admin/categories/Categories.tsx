import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { categoriesService } from "../../../services/categoriesService";
import type { RootState } from "../../../app/store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Toast from "../../../components/UI/Toast/Toast";
import styles from "./categories.module.css";
import type { Category } from "../../../types";

import AdminCategoriesCart from "../../../components/admin/AdminCategories/AdminCategoriesCart";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import AdminHeader from "../../../components/admin/common/AdminHeader";

// Define the structure of the data returned from the categories API, which includes a message and an array of Category objects.
interface data {
  message: string;
  categories: Category[];
}

export default function Categories(): React.JSX.Element {
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);
  // Initialize state and references for managing toast notifications, confirmation dialogs, and selected category ID for deletion.
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const confirmRef = useRef<HTMLDialogElement>(null);
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();
  // Use the useQueryClient hook from React Query to get the query client instance, which allows us to invalidate queries and refetch data after a category is deleted.
  const queryClient = useQueryClient();
  // Use the useQuery hook from React Query to fetch the list of categories from the server. It handles loading, error, and success states.
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<data>({
    queryKey: ["categories"],
    queryFn: async (): Promise<data> => {
      const response = await categoriesService.getAll();
      return response as data;
    },
    enabled: !!token,
  });
  
  // showToast function displays the toast message for a short duration.
    const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };
  
  // useEffect hook to handle errors from the query. If there is an error, it sets the toast message and type, and shows the toast notification.
  useEffect(() => {
    if (queryError) {
      const handleError = () => {
        setToastMessage(`Error: ${queryError.message}`);
        setToastType("error");
        showToast();
      };
      handleError();
    }
  }, [queryError]);

  if (isLoading) {
    return <Spinner />;
  }

  // Handle navigation to the Edit Category page for a specific category when the "Edit" button is clicked
  const handleEdit = (id: string) => {
    navigate(`/admin/categories/edit/${id}`);
  };

  // Handle the deletion of a category by setting the selected category ID and showing the confirmation dialog
  const handleDelete = (id: string) => {
    setSelectedId(id);
    confirmRef.current?.showModal();
  };

  // handleConfirmDelete function is called when the user confirms the deletion of a category.
  const handleConfirmDelete = async () => {
    if (selectedId) {
      try {
        await categoriesService.deleteCategory(selectedId);
        setToastMessage("Category deleted successfully");
        setToastType("success");
        showToast();
        queryClient.invalidateQueries({ queryKey: ["categories"] });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : String(err);
        setToastMessage("Failed to delete category: " + errorMessage);
        setToastType("error");
        showToast();
      }
    }
  };

  return (
    <>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />
      <ConfirmDialog
        ref={confirmRef}
        title="Delete Category"
        message="Are you sure you want to delete this category?"
        onConfirm={handleConfirmDelete}
      />
      <AdminHeader onAddClick={() => navigate("/admin/categories/add")} pageName="Category" />
      <div className={styles.container}>
        <h1 className={styles.title}>Categories Management</h1>
        <div className={styles.categoriesWrapper}>
          {data?.categories.map((category: Category) => (
            <div key={category._id} className={styles.categoryCard}>
              <AdminCategoriesCart
                category={category}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
