import { useState, useRef } from "react";
import { useMutation } from "@tanstack/react-query";

import { newsletterService } from "../../../services/newsletterService";

import Toast from "../../../components/UI/Toast/Toast";

import styles from "./newsletter.module.css";

export default function Newsletter() {
  // Create a ref for the toast dialog to control its visibility and manage toast messages and types
  const toastRef = useRef<HTMLDialogElement>(
    null,
  ) as React.RefObject<HTMLDialogElement>;
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [subject, setSubject] = useState(""); // State to hold the subject of the newsletter
  const [content, setContent] = useState(""); // State to hold the content of the newsletter

  // showToast function displays the toast message for a short duration.
  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Use the useMutation hook from React Query to handle the newsletter sending process. It manages the mutation state and provides callbacks for success and error handling.
  const mutation = useMutation({
    mutationFn: () => newsletterService.sendNewsletter(subject, content),

    // onSuccess and onError callbacks are defined to handle the outcomes of the newsletter sending process. On success, it clears the subject and content fields and shows a success toast message. On error, it shows an error toast message.
    onSuccess: () => {
      setSubject("");
      setContent("");
      setToastMessage("Newsletter sent successfully.");
      setToastType("success");
      showToast();
    },
    onError: () => {
      setToastMessage("Failed to send newsletter.");
      setToastType("error");
      showToast();
    },
  });

  // handleSubmit function is called when the newsletter form is submitted. It validates the subject and content fields and triggers the mutation to send the newsletter.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate that both subject and content fields are not empty before sending the newsletter. If either field is empty, it shows an error toast message and returns early.
    if (!subject.trim() || !content.trim()) {
      setToastMessage("Subject and content cannot be empty.");
      setToastType("error");
      showToast();
      return;
    }
    mutation.mutate(); // Trigger the mutation to send the newsletter
  };

  return (
    <section className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>Send Newsletter</h1>

        <p className={styles.subtitle}>
          Send a newsletter to all subscribed users.
        </p>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label>Subject</label>

            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Newsletter subject"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Content</label>

            <textarea
              rows={8}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your newsletter content..."
            />
          </div>

          <button
            type="submit"
            className={styles.submitBtn}
            disabled={mutation.isPending}
          >
            {mutation.isPending ? "Sending..." : "Send Newsletter"}
          </button>
        </form>

        {mutation.isPending}

        <Toast ref={toastRef} type={toastType} message={toastMessage} />
      </div>
    </section>
  );
}
