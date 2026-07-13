import { useState, useRef } from "react";
import { authService } from "../../services/authService";
import styles from "./auth.module.css";
import Toast from "../../components/UI/Toast/Toast";

export default function ForgetPassword() {
  // State variable to hold the email input value
  const [email, setEmail] = useState("");
  
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

  // Handle form submission for sending the password reset link
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Call the authService to initiate the password reset process. If successful, show a success toast message. If there's an error, show an error toast message.
    try {
      await authService.forgetPassword(email);
      setToastType("success");
      setToastMessage("If this email exists, a reset link has been sent.");
      showToast();
    } catch (err: unknown) {
      setToastType("error");
      setToastMessage(
        err instanceof Error
          ? err.message
          : "Failed to send reset link. Please try again.",
      );
      showToast();
    }
  };
  return (
    <section className={styles.authPage}>
      <div className={styles.authContainer}>
        <h1 className={styles.authTitle}>Forget Password</h1>
        <p className={styles.authDescription}>
          Please enter your email to reset your password.
        </p>
        <form className={styles.authForm} onSubmit={handleSubmit}>
          <input
            className={styles.authInput}
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit" className={styles.authButton}>
            Send Reset Link
          </button>
        </form>
        <Toast ref={toastRef} message={toastMessage} type={toastType} />
      </div>
    </section>
  );
}
