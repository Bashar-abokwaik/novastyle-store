import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import { collectionsService } from "../../../services/collectionsService";
import type { RootState } from "../../../app/store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Toast from "../../../components/UI/Toast/Toast";
import styles from "./collection.module.css";
import type { Collection } from "../../../types";

import AdminCollectionsCart from "../../../components/admin/AdminCollection/AdminCollectionsCart";
import ConfirmDialog from "../../../components/common/ConfirmDialog";
import AdminHeader from "../../../components/admin/common/AdminHeader";

// Define the structure of the data returned from the collections API, which includes a message and an array of Collection objects.
interface data {
  message: string;
  collections: Collection[];
}

export default function Collections(): React.JSX.Element {
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);
  // Initialize state and references for managing toast notifications, confirmation dialogs, and selected collection ID for deletion.
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState<string>("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  // Initialize state and references for managing confirmation dialogs and selected collection ID for deletion.
  const confirmRef = useRef<HTMLDialogElement>(null);
  // State to hold the ID of the selected collection for deletion
  const [selectedId, setSelectedId] = useState("");
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // Use the useQueryClient hook from React Query to get the query client instance, which allows us to invalidate queries and refetch data after a collection is deleted.
  // Use the useQuery hook from React Query to fetch the list of collections from the server. It handles loading, error, and success states.
  const {
    data,
    isLoading,
    error: queryError,
  } = useQuery<data>({
    queryKey: ["collections"],
    queryFn: async (): Promise<data> => {
      const response = await collectionsService.getAll();
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

  // useEffect hook to handle errors from the collections query. If an error occurs, it shows a toast message with the error details.
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

  // Handle the edit action for a collection. It navigates to the edit page for the selected collection.
  const handleEdit = (id: string) => {
    navigate(`/admin/collections/edit/${id}`);
  };

  // Handle the delete action for a collection. It sets the selected collection ID and shows the confirmation dialog.
  const handleDelete = (id: string) => {
    setSelectedId(id);
    confirmRef.current?.showModal();
  };

  // Handle the confirmation of deletion for a collection. It sends a delete request to the server and handles success or error responses, showing appropriate toast messages and invalidating the collections query to refresh the list.
  const handleConfirmDelete = async () => {
    confirmRef.current?.close();

    // If a collection ID is selected, attempt to delete the collection using the collectionsService. On success, show a success toast message and invalidate the collections query to refresh the list. On error, show an error toast message.
    if (selectedId) {
      // Try to delete the selected collection and handle success or error responses
      try {
        await collectionsService.deleteCollection(selectedId);
        setToastMessage("Collection deleted successfully");
        setToastType("success");
        showToast();
        queryClient.invalidateQueries({ queryKey: ["collections"] });
      } catch (err: unknown) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to delete collection";
        setToastMessage(errorMessage);
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
        title="Delete Collection"
        message="Are you sure you want to delete this collection? Products assigned to this collection will not be deleted, but they will be removed from the collection."
        onConfirm={handleConfirmDelete}
      />
      <AdminHeader
        onAddClick={() => navigate("/admin/collections/add")}
        pageName="Collection"
      />
      <div className={styles.container}>
        <h1 className={styles.title}>Collections Management</h1>
        <div className={styles.collectionsWrapper}>
          {data?.collections.map((collection: Collection) => (
            <div key={collection._id} className={styles.collectionCard}>
              <AdminCollectionsCart
                collection={collection}
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
