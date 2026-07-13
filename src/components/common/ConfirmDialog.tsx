import { forwardRef } from "react";
import styles from "./confirmDialog.module.css";

// Define the ConfirmDialog component, which is a reusable dialog box that prompts the user for confirmation before performing an action. It accepts a title, message, and onConfirm callback function as props.
interface ConfirmDialogProps {
  title: string;
  message: string;
  onConfirm: () => void;
}

// The ConfirmDialog component uses the forwardRef function to allow parent components to control its visibility. It renders a dialog with a title, message, and two buttons: "Cancel" and "Confirm". When the "Confirm" button is clicked, the onConfirm callback is executed, and the dialog is closed.
const ConfirmDialog = forwardRef<HTMLDialogElement, ConfirmDialogProps>(
  ({ title, message, onConfirm }, ref) => {
    return (
      <dialog ref={ref} className={styles.dialog}>
        <div className={styles.content}>
          <h2>{title}</h2>

          <p>{message}</p>

          <div className={styles.actions}>
            <button
              className={styles.cancel}
              onClick={() =>
                (ref as React.RefObject<HTMLDialogElement>).current?.close()
              }
            >
              Cancel
            </button>

            <button
              className={styles.confirm}
              onClick={() => {
                onConfirm();
                (ref as React.RefObject<HTMLDialogElement>).current?.close();
              }}
            >
              Confirm
            </button>
          </div>
        </div>
      </dialog>
    );
  },
);

export default ConfirmDialog;
