import { useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import styles from "./auth.module.css";
import Toast from "../../components/UI/Toast/Toast";
import { Eye, EyeOff } from "lucide-react";

export default function ResetPassword() {
  const { token } = useParams(); // Get the reset token from the URL parameters
  const navigate = useNavigate();

  // State variables to manage new password and confirm password inputs
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State variables to manage password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // State variables to manage toast messages and their types (success or error)
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const toastRef = useRef<HTMLDialogElement>(null!);

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Handle form submission for resetting the password
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      setToastType("error");
      setToastMessage("Invalid reset link");
      showToast();
      return;
    }

    if (newPassword !== confirmPassword) {
      setToastType("error");
      setToastMessage("Passwords do not match");
      showToast();
      return;
    }

    // Call the authService to reset the password using the provided token and new password. If successful, show a success toast message and navigate to the login page. If there's an error, show an error toast message.
    try {
      await authService.resetPassword(token, newPassword, confirmPassword);

      setToastType("success");
      setToastMessage("Password has been reset successfully!");
      showToast();
      navigate("/login");
    } catch (err) {
      setToastType("error");
      setToastMessage(err instanceof Error ? err.message : "Reset failed");
      showToast();
    }
  };

  return (
    <section className={styles.resetPasswordPage}>
      <div className={styles.resetPasswordCard}>
        <h1 className={styles.resetPasswordTitle}>Reset Password</h1>
        <p className={styles.resetPasswordDescription}>
          Please enter your new password below.
        </p>

        <form className={styles.resetPasswordForm} onSubmit={handleSubmit}>
          {/* NEW PASSWORD */}
          <div className={styles.formGroup}>
            <label>New Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowNewPassword((prev) => !prev)}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {/* CONFIRM PASSWORD */}
          <div className={styles.formGroup}>
            <label>Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() =>
                  setShowConfirmPassword((prev) => !prev)
                }
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Reset Password
          </button>
        </form>

        <Toast ref={toastRef} message={toastMessage} type={toastType} />
      </div>
    </section>
  );
}