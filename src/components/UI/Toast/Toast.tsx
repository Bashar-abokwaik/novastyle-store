import styles from "./Toast.module.css";

// Toast component that displays a message with a specific type (success or error)
// The component uses a dialog element to show the toast message, and it can be referenced using a React ref for programmatic control.

export default function Toast({
  message,
  type,
  ref,
}: {
  message: string;
  type: "success" | "error";
  ref: React.RefObject<HTMLDialogElement>;
}) {
  return (
    <dialog className={`${styles.toast} ${styles[type]}`} ref={ref}>
      <p>{message}</p>
    </dialog>
  );
}
