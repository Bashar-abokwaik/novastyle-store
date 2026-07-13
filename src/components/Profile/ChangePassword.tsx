import { authService } from "../../services/authService";
import { useState, useRef } from "react";
import { Eye, EyeOff } from "lucide-react";
import Toast from "../../components/UI/Toast/Toast";

import styles from "./profile.module.css";

export default function ChangePassword() {
  // State variables for managing password visibility, toast notifications, and form errors
  const [showPassword, setShowPassword] = useState(false);
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [errors, setErrors] = useState<{
    newPassword?: string;
  }>({});

  // Function to show toast notifications
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Function to handle input blur events for validation
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "newPassword") {
        newErrors.newPassword =
          value.length >= 8 ? "" : "New password must be at least 8 characters";
      }
      return newErrors;
    });
  };

  // Function to handle input focus events to clear validation errors
  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setErrors((prev) => {
      const newErrors = { ...prev };
      if (name === "newPassword") {
        newErrors.newPassword = "";
      }
      return newErrors;
    });
  };

  // Function to handle form submission for changing the password
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // Extract form data
    const formData = new FormData(event.currentTarget);
    // Validate the new password and confirm password fields
    const currentPassword = formData.get("currentPassword") as string;
    // Check for validation errors before proceeding
    if (errors.newPassword) {
      setToastType("error");
      setToastMessage("Please fix the errors before submitting");
      showToast();
      return;
    }
    // Check if new password and confirm password match
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    if (newPassword !== confirmPassword) {
      setToastType("error");
      setToastMessage("New password and confirmation do not match");
      showToast();
      return;
    }
    // Attempt to change the password using the authService
    try {
      await authService.changePassword(
        currentPassword,
        newPassword,
        confirmPassword,
      );
      setToastType("success");
      setToastMessage("Password changed successfully");
      showToast();
    } catch (error) {
      setToastType("error");
      setToastMessage(
        error instanceof Error ? error.message : "Failed to change password",
      );
      showToast();
    }
  };

  return (
    <section className={styles.profileSection}>
      <Toast ref={toastRef} type={toastType} message={toastMessage} />
      <div className={styles.changePassword}>
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="currentPassword">Current Password:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="currentPassword"
                name="currentPassword"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="newPassword">New Password:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                required
                onBlur={handleBlur}
                onFocus={handleFocus}
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            {errors.newPassword && (
              <span className={styles.error}>{errors.newPassword}</span>
            )}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm New Password:</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>
          <button type="submit" className={styles.changePasswordBtn}>
            Change Password
          </button>
        </form>
      </div>
    </section>
  );
}
