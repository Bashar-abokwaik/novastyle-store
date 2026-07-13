import { useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "../../services/userService";
import { useDispatch } from "react-redux";
import styles from "./profile.module.css";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/auth/authSlice";
import { isValidEmail } from "../../utils/validation";

import Spinner from "../UI/Spinner/Spinner";
import Toast from "../UI/Toast/Toast";
import ConfirmModal from "./ConfirmModal";

// Define the structure of the user response from the API
interface userResponse {
  message: string;
  user: {
    _id: string;
    name: string;
    email: string;
    address: {
      country: string;
      city: string;
      street: string;
      postalCode: string;
    };
  };
}

export default function ProfileInfo() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // State variables for managing the profile editing state and toast notifications
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [originalData, setOriginalData] = useState<userResponse | null>(null);
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [emailErrorsMessage, setEmailErrorsMessage] = useState("");
  const [nameErrorsMessage, setNameErrorsMessage] = useState("");
  const [warningMessage, setWarningMessage] = useState("");

  // Function to display toast notifications
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Use React Query to fetch the current user's profile data
  const { data: userData, isLoading } = useQuery<userResponse, Error>({
    queryKey: ["userProfile"],
    queryFn: async (): Promise<userResponse> => {
      const response = await userService.getUserProfile();
      return response as userResponse;
    },
  });

  useEffect(() => {
    // Set the original data when userData is fetched and originalData is not set
    if (userData && !originalData) {
      setOriginalData(userData);
    }
  }, [userData, originalData]);

  // Get the query client for managing cached data
  const queryClient = useQueryClient();

  // Function to handle saving the updated profile information
  const handleSave = async () => {
    // Get the current profile data from the query cache
    const currentData = queryClient.getQueryData<userResponse>(["userProfile"]);

    // Validate that the current data exists before proceeding
    if (!currentData) {
      setToastType("error");
      setToastMessage(
        "Failed to fetch current profile data. Please try again.",
      );
      showToast();
      return;
    }

    // Validate the email format and name field before proceeding
    if (!isValidEmail(currentData.user.email)) {
      setToastType("error");
      setToastMessage("Please enter a valid email");
      showToast();
      return;
    }
    if (currentData.user.name.trim() === "") {
      setToastType("error");
      setToastMessage("Name cannot be empty");
      showToast();
      return;
    }

    // Check if the email has changed from the original email
    const emailChanged = currentData.user.email !== originalData?.user.email;

    // If the email has changed, show the email confirmation modal and return early
    if (emailChanged) {
      setShowEmailModal(true);
      return;
    }

    // Prepare the updated data to be sent to the API
    const updatedData = {
      ...currentData,
      user: {
        ...currentData.user,
        name: currentData.user.name,
        email: currentData.user.email,
        address: {
          ...currentData.user.address,
        },
      },
    };

    // Attempt to update the user profile using the userService
    try {
      await userService.updateUserProfile(updatedData.user);
      setToastType("success");
      setToastMessage("Profile updated successfully!");
      showToast();
      setIsEditing(false);
    } catch (error) {
      setToastType("error");
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.",
      );
      showToast();
    }
  };

  // Function to confirm the email change and update the profile
  const confirmEmailChange = async () => {
    console.log("Confirming email change...");
    const currentData = queryClient.getQueryData<userResponse>(["userProfile"]);

    // Validate that the current data exists before proceeding
    if (!currentData) {
      setToastType("error");
      setToastMessage(
        "Failed to fetch current profile data. Please try again.",
      );
      showToast();
      return;
    }

    // Prepare the updated data to be sent to the API
    const updatedData = {
      ...currentData,
      user: {
        ...currentData.user,
        name: currentData.user.name,
        email: currentData.user.email,
        address: {
          ...currentData.user.address,
        },
      },
    };

    // Attempt to update the user profile using the userService
    try {
      // Update the user profile with the new email
      await userService.updateUserProfile(updatedData.user);

      dispatch(logout()); // Log out the user after email change

      // Clear the authentication token from local storage
      localStorage.removeItem("token");

      // Navigate to the email verification page with the updated email
      navigate("/verify-email", {
        state: { email: updatedData.user.email },
      });
    } catch (error) {
      setToastType("error");
      setToastMessage(
        error instanceof Error
          ? error.message
          : "Failed to update profile. Please try again.",
      );
      showToast();
    } finally {
      setShowEmailModal(false);
    }
  };

  const cancelChanges = () => {
    // Reset the editing state and clear error messages
    setIsEditing(false);
    setEmailErrorsMessage("");
    setNameErrorsMessage("");
    setWarningMessage("");

    // Reset the user data in the query cache to the original data
    queryClient.setQueryData<userResponse>(["userProfile"], (old) => {
      if (!old || !originalData) return old;
      return {
        ...old,
        user: {
          ...old.user,
          name: originalData.user.name,
          email: originalData.user.email,
          address: {
            ...originalData.user.address,
          },
        },
      };
    });
  };

  // Function to handle blur events on input fields and validate the input values
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const errorMessage =
      name === "email" && !isValidEmail(value)
        ? "Please enter a valid email"
        : name === "name" && value.trim() === ""
          ? "Name cannot be empty"
          : "";
    if (errorMessage) {
      if (name === "email") {
        setEmailErrorsMessage(errorMessage);
      } else if (name === "name") {
        setNameErrorsMessage(errorMessage);
      }
    }
  };

  // Function to handle focus events on input fields and clear any existing error messages
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    if (name === "email") {
      setEmailErrorsMessage("");
    } else if (name === "name") {
      setNameErrorsMessage("");
    }
  };

  // Function to handle changes in the input fields and update the query cache
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Update the user data in the query cache with the new input value
    queryClient.setQueryData<userResponse>(["userProfile"], (old) => {
      // If there is no existing data, return the old data
      if (!old) return old;

      // If the changed field is part of the address, update the address object
      if (["country", "city", "street", "postalCode"].includes(name)) {
        return {
          ...old,
          user: {
            ...old.user,
            address: {
              ...old.user.address,
              [name]: value,
            },
          },
        };
      }

      if (name === "email") {
        // If the email has changed, show a warning message about email verification
        if (value !== originalData?.user.email) {
          setWarningMessage("Changing email requires verification and logout.");
        } else {
          setWarningMessage("");
        }
      }

      // For other fields, update the user object directly
      return {
        ...old,
        user: {
          ...old.user,
          [name]: value,
        },
      };
    });
  };

  return (
    <>
      <Toast ref={toastRef} type={toastType} message={toastMessage} />
      {isLoading && <Spinner />}
      <div className={styles.card}>
        <div className={styles.header}>
          <h2>Profile Information</h2>

          {!isEditing ? (
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </button>
          ) : (
            <div className={styles.actions}>
              <button className={styles.saveBtn} onClick={handleSave}>
                Save
              </button>

              <button
                className={styles.cancelBtn}
                onClick={() => {
                  cancelChanges();
                }}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        <div className={styles.content}>
          <div className={styles.field}>
            <label>Name</label>

            {isEditing ? (
              <>
                <input
                  name="name"
                  defaultValue={userData?.user.name || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
                {nameErrorsMessage && (
                  <div className={styles.errorMessage}>{nameErrorsMessage}</div>
                )}
              </>
            ) : (
              <span>{userData?.user.name}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Email</label>

            {isEditing ? (
              <>
                <input
                  name="email"
                  defaultValue={userData?.user.email || ""}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                />
                {emailErrorsMessage && (
                  <div className={styles.errorMessage}>
                    {emailErrorsMessage}
                  </div>
                )}
                {warningMessage && (
                  <small className={styles.warning}>{warningMessage}</small>
                )}
              </>
            ) : (
              <span>{userData?.user.email}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Country</label>

            {isEditing ? (
              <input
                name="country"
                defaultValue={userData?.user.address.country || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{userData?.user.address.country}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>City</label>

            {isEditing ? (
              <input
                name="city"
                defaultValue={userData?.user.address.city || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{userData?.user.address.city}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Street</label>

            {isEditing ? (
              <input
                name="street"
                defaultValue={userData?.user.address.street || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{userData?.user.address.street}</span>
            )}
          </div>

          <div className={styles.field}>
            <label>Postal Code</label>

            {isEditing ? (
              <input
                name="postalCode"
                defaultValue={userData?.user.address.postalCode || ""}
                onChange={handleChange}
              />
            ) : (
              <span>{userData?.user.address.postalCode}</span>
            )}
          </div>
        </div>
      </div>
      {showEmailModal && (
        <ConfirmModal
          setShowEmailModal={setShowEmailModal}
          confirmEmailChange={confirmEmailChange}
        />
      )}
    </>
  );
}
