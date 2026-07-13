import { useState, useRef, useEffect } from "react";
import { authService } from "../../services/authService";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../../features/auth/authSlice";
import styles from "./auth.module.css";
import Toast from "../../components/UI/Toast/Toast";

export default function VerifyEmailOTP() {
  // State variables to manage OTP input, toast messages, and their types (success or error)
  const [otp, setOtp] = useState("");
  const toastRef = useRef<HTMLDialogElement>(null!);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  // State variables to manage the resend OTP functionality, including a countdown timer and a flag to indicate if the OTP is being resent
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (countdown === 0) return;

    const timer = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Handle resend OTP functionality
  const handleResendOtp = async () => {
    const email = location.state?.email;

    console.log("Email:", email);
    if (!email) {
      setToastMessage("Email not found.");
      setToastType("error");
      showToast();
      return;
    }

    // Call the authService to resend the OTP to the user's email. If successful, show a success toast message and reset the countdown timer. If there's an error, show an error toast message.
    try {
      setIsResending(true);

      await authService.resendOtp(email);

      setToastMessage("A new OTP has been sent.");
      setToastType("success");
      showToast();

      setCountdown(60);
    } catch (err) {
      setToastMessage(
        err instanceof Error ? err.message : "Failed to resend OTP.",
      );
      setToastType("error");
      showToast();
    } finally {
      setIsResending(false);
    }
  };

  // Handle form submission for verifying the OTP
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const email = location.state?.email;

      if (!email) {
        setToastMessage("Email not found. Please register again.");
        setToastType("error");
        showToast();
        return;
      }

      const res = await authService.verifyEmail(email, otp);

      // save user + token
      dispatch(login({ token: (res as { token: string }).token }));
      setToastMessage("Email verified successfully!");
      setToastType("success");
      showToast();

      navigate("/");
    } catch (err: unknown) {
      setToastMessage(
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.",
      );
      setToastType("error");
      showToast();
    }
  };

  return (
    <section className={styles.authPage}>
      <div className={styles.authContainer}>
        <h1 className={styles.authTitle}>Verify Email</h1>
        <p className={styles.authDescription}>
          Please enter the OTP sent to your email to verify your account.
        </p>
        <form onSubmit={handleSubmit} className={styles.authForm}>
          <div className={styles.inputWrapper}>
            <input
              className={styles.authInput}
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            {countdown > 0 ? (
              <span className={styles.resendButton}>{countdown}s</span>
            ) : (
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isResending}
                className={styles.resendButton}
              >
                {isResending ? "Sending..." : "Resend"}
              </button>
            )}
          </div>
          <button type="submit" className={styles.authButton}>
            Verify
          </button>
        </form>
        <Toast message={toastMessage} type={toastType} ref={toastRef} />
      </div>
    </section>
  );
}
