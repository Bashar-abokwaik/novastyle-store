import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import { authService } from "../../services/authService";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import Toast from "../../components/UI/Toast/Toast";

import { isValidEmail } from "../../utils/validation";

import styles from "./auth.module.css";

export default function Login() {
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [showPassword, setShowPassword] = useState(false);

  // State variables to manage form validation errors
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
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

  const dispatch = useDispatch();
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
        newErrors.password =
          value.length >= 8 ? "" : "Password must be at least 8 characters";
      }

      return newErrors;
    });
  };

  // Handle form submission for logging in the user
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const newErrors: typeof errors = {};

    if (!isValidEmail(email)) {
      newErrors.email = "Please enter a valid email";
      setToastType("error");
      setToastMessage("Please enter a valid email");
      showToast();
    }

    if (!password || password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      setToastType("error");
      setToastMessage("Password must be at least 8 characters");
      showToast();
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;
    // Attempt to log in the user using the authService. If successful, dispatch the login action and navigate to the appropriate page based on the user's role. If there's an error, show an error toast message and navigate to the email verification page if the email is not verified.
    try {
      const response = (await authService.login(email, password)) as {
        token: string;
        user: { role: string };
      };

      const token = response.token;
      const role = response.user.role;

      dispatch(login({ token })); // Save the token in the Redux store for authentication

      // Navigate to the appropriate page based on the user's role after successful login
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
      setToastType("success");
      setToastMessage("Logged in successfully!");
      showToast();
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Login failed. Please try again.";
      setToastType("error");
      setToastMessage(errorMessage);
      showToast();
      
      // If the error message indicates that the email is not verified, navigate to the email verification page and pass the email as state for further processing.
      if (errorMessage === "Email not verified") {
        navigate("/verify-email", { state: { email } });
      }
    }
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.topSection}>
          <h1 className={styles.authTitle}>Welcome Back</h1>

          <p className={styles.authSubtitle}>
            Login to continue shopping at NovaStyle.
          </p>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
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
                placeholder="Enter your password"
                onBlur={handleBlur}
                required
                autoComplete="current-password"
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

          <button type="submit" className={styles.submitBtn}>
            Login
          </button>
        </form>

        <div className={styles.authFooter}>
          Don’t have an account?
          <Link to="/register"> Register</Link>
          <br />
          <Link to="/forget-password">Forgot Password?</Link>
        </div>
      </div>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />
    </section>
  );
}
