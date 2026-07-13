import { userService } from "../../services/userService";
import { useState, useRef } from "react";
import styles from "./addressSection.module.css";
import Toast from "../UI/Toast/Toast";

// AddressSection component allows users to view and update their address details. It takes in the current address and a function to update the address state as props.
export default function AddressSection({
  address,
  setAddress,
}: {
  address: {
    country: string;
    city: string;
    street: string;
    postalCode: string;
  };
  setAddress: React.Dispatch<
    React.SetStateAction<{
      country: string;
      city: string;
      street: string;
      postalCode: string;
    }>
  >;
}) {
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Handle the address update form submission
  const handleAddressUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that all address fields are filled in before attempting to update the address. If any field is empty, show an error toast message and return early.
    if (
      !address.country.trim() ||
      !address.city.trim() ||
      !address.street.trim() ||
      !address.postalCode.trim()
    ) {
      setToastMessage("Please fill in all address fields.");
      setToastType("error");
      showToast();
      return;
    }
    // Call the userService to update the user's address with the current address state. Show a success or error toast message based on the result.
    try {
      await userService.updateUserAddress(address);
      setToastMessage("Address updated successfully!");
      setToastType("success");
      showToast();
    } catch {
      setToastMessage("Failed to update address. Please try again.");
      setToastType("error");
      showToast();
    }
  };

  return (
    <div className={styles.addressSection}>
      <h2 className={styles.title}>Your Address</h2>
      <p className={styles.subtitle}>Please enter your address details.</p>
      <div className={styles.addressDetails}>
        <form onSubmit={handleAddressUpdate} className={styles.addressForm}>
          <div className={styles.formGroup}>
            <label htmlFor="country">Country:</label>
            <input
              type="text"
              id="country"
              name="country"
              value={address.country}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, country: e.target.value }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={address.city}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, city: e.target.value }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="street">Street:</label>
            <input
              type="text"
              id="street"
              name="street"
              value={address.street}
              onChange={(e) =>
                setAddress((prev) => ({ ...prev, street: e.target.value }))
              }
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="postalCode">Postal Code:</label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={address.postalCode}
              onChange={(e) =>
                setAddress((prev) => ({
                  ...prev,
                  postalCode: e.target.value,
                }))
              }
            />
          </div>
          <button type="submit" className={styles.saveButton}>
            Save Address
          </button>
        </form>
      </div>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />
    </div>
  );
}
