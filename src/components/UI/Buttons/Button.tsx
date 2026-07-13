import type { ButtonHTMLAttributes } from "react";
import styles from "./button.module.css";

// ButtonProps extends the default button HTML attributes and adds an optional variant property
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary";
};

// Button component that renders a button element with customizable styles based on the variant prop
export default function Button({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonProps) {
  return (
    <button
      className={`${styles.btn} ${styles[variant]} ${className || ""}`}
      {...props}
    >
      {children}
    </button>
  );
}
