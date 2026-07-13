import styles from "./profile.module.css";

// Define the ConfirmModal component, which displays a modal dialog to confirm the user's intention to change their email. It provides information about the consequences of changing the email and includes "Cancel" and "Continue" buttons for user interaction.
export default function ConfirmModal({ setShowEmailModal, confirmEmailChange }: { setShowEmailModal: React.Dispatch<React.SetStateAction<boolean>>, confirmEmailChange: () => Promise<void> }) {
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <h3>Change Email?</h3>

        <p>Changing your email will:</p>

        <ul>
          <li>Log you out immediately</li>
          <li>Require email verification</li>
          <li>Disable account access until verification</li>
        </ul>

        <div className={styles.modalActions}>
          <button
            className={styles.cancelBtn}
            onClick={() => setShowEmailModal(false)}
          >
            Cancel
          </button>

          <button className={styles.confirmBtn} onClick={confirmEmailChange}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}
