import { useRef, useState } from "react";
import { authService } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Toast from "../../components/UI/Toast/Toast";

import { isValidEmail, isValidPassword } from "../../utils/validation";

import styles from "./auth.module.css";

export default function Register() {
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  // State variables to manage password visibility toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  // Function to show toast messages
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  const navigate = useNavigate();

  // Handle blur event for form fields to validate input values and set error messages accordingly
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setErrors((prev) => {
      const newErrors = { ...prev };

      if (name === "email") {
        newErrors.email = isValidEmail(value)
          ? ""
          : "Please enter a valid email";
      }

      if (name === "password") {
        newErrors.password = isValidPassword(value)
          ? ""
          : "Password must contain 8+ chars & numbers";
      }

      if (name === "confirmPassword") {
        const password = (
          document.getElementById("password") as HTMLInputElement
        )?.value;

        newErrors.confirmPassword =
          value === password ? "" : "Passwords do not match";
      }

      return newErrors;
    });
  };

  // Handle form submission for registering a new user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("submit works");

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    const newErrors: typeof errors = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
      setToastType("error");
      setToastMessage("Please enter a valid email");
      showToast();
    }

    if (!isValidPassword(password)) {
      newErrors.password = "Password must contain 8+ chars & numbers";
      setToastType("error");
      setToastMessage("Password must contain 8+ chars & numbers");
      showToast();
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      setToastType("error");
      setToastMessage("Passwords do not match");
      showToast();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    try {
      await authService.register(
        formData.get("name") as string,
        email,
        password
      );
      navigate("/verify-email", {
        state: { email },
      });
    } catch (error: unknown) {
      setToastType("error");
      setToastMessage(
        (error instanceof Error ? error.message : "Registration failed") ||
          "Registration failed",
      );
      showToast();
      return;
    }
    
    setToastType("success");
    setToastMessage("OTP sent to your email");
    showToast();
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.topSection}>
          <h1 className={styles.authTitle}>Create Account</h1>

          <p className={styles.authSubtitle}>
            Join NovaStyle and explore modern fashion.
          </p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              type="text"
              name="name"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              type="email"
              name="email"
              placeholder="Enter your email"
              onBlur={handleBlur}
              required
              autoComplete="email"
            />

            {errors.email && (
              <span className={styles.errorText}>{errors.email}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="password">Password</label>

            <div className={styles.passwordWrapper}>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create password"
                onBlur={handleBlur}
                required
                autoComplete="new-password"
              />

              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && (
              <span className={styles.errorText}>{errors.password}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className={styles.passwordWrapper}>
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm password"
                onBlur={handleBlur}
                required
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.passwordToggle}
                onClick={() => setShowConfirmPassword((prev) => !prev)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.confirmPassword && (
              <span className={styles.errorText}>{errors.confirmPassword}</span>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Account
          </button>
        </form>

        <div className={styles.authFooter}>
          Already have an account?
          <Link to="/login"> Login</Link>
        </div>
      </div>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />
    </section>
  );
}
