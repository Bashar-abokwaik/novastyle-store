import styles from "./Toast.module.css";

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
    <dialog className={`${styles.toast} ${styles[type]}`} ref={ref} open>
      <p>{message}</p>
    </dialog>
  );
}
