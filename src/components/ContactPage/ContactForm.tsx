import { useState, useRef } from "react";
import { contactService } from "../../services/contactService";
import Toast from "../UI/Toast/Toast";
import styles from "./contact.module.css";
import { validateField } from "../../utils/validation";

interface ContactMessage {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export default function ContactForm() {
  // State and refs for managing form data, errors, touched fields, toast messages, and submission state
  const toastRef = useRef<HTMLDialogElement>(null!);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [formData, setFormData] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({
    name: false,
    email: false,
    subject: true, // subject is optional, so we can mark it as touched by default
    message: false,
  });

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  // Function to handle blur event on form fields
  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  // Function to handle change event on form fields
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setState("idle");
    if (touched[name]) {
      setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields before submission
    if (
      Object.values(errors).some((error) => error) ||
      !formData.name ||
      !formData.email ||
      !formData.message
    ) {
      setToastType("error");
      setToastMessage("Please fill all required fields");
      showToast();
      return;
    }

    setState("loading");

    // Send the contact message using the contactService
    try {
      await contactService.sendContactMessage(
        formData.name,
        formData.email,
        formData.subject ? formData.subject : "",
        formData.message,
      );

      setFormData({ name: "", email: "", subject: "", message: "" });

      setErrors({ name: "", email: "", subject: "", message: "" });

      setState("success");
      setToastMessage("Message sent successfully!");
      setToastType("success");
      showToast();
    } catch (error) {
      setState("error");
      setToastMessage("Failed to send message");
      setToastType("error");
      showToast();
      console.error("Error sending contact message:", error);
    }
  };

  return (
    <>
      <form className={styles.contactForm} onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label className={styles.formLabel} htmlFor="name">
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.nameInput} ${errors.name ? styles.errorInput : ""}`}
            placeholder="Your full name"
          />
          {errors.name && <p className={styles.errorText}>{errors.name}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.formLabel}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.emailInput} ${errors.email ? styles.errorInput : ""}`}
            placeholder="Your email address"
          />
          {errors.email && <p className={styles.errorText}>{errors.email}</p>}
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="subject" className={styles.formLabel}>
            Subject:
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            className={styles.subjectInput}
            placeholder="Subject (optional)"
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="message" className={styles.formLabel}>
            Message:
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles.messageInput} ${errors.message ? styles.errorInput : ""}`}
            placeholder="Your message"
          ></textarea>
          {errors.message && (
            <p className={styles.errorText}>{errors.message}</p>
          )}
        </div>
        <button
          type="submit"
          className={styles.submitButton}
          disabled={state === "loading"}
        >
          Send Message
        </button>
      </form>
      <Toast ref={toastRef} message={toastMessage} type={toastType} />
    </>
  );
}
