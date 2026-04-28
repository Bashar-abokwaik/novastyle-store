import { useState, useRef } from "react";
import { contactService } from "../../services/contactService";
import type { ContactMessage } from "../../services/contactService";
import Toast from "../UI/Toast/Toast";
import styles from "./contact.module.css";

export default function ContactForm() {
  const toastRef = useRef<HTMLDialogElement>(null!);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error">(
    "idle",
  );
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [formData, setFormData] = useState<ContactMessage>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const showToast = () => {
    if (toastRef.current) {
      toastRef.current.showModal();
      setTimeout(() => {
        toastRef.current?.close();
      }, 3000);
    }
  };

  const validate = () => {
    const newErrors = {
      name: "",
      email: "",
      message: "",
    };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    setErrors(newErrors);

    return !newErrors.name && !newErrors.email && !newErrors.message;
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
    setState("idle");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      setToastType("error");
      setToastMessage("Please fill all required fields");
      showToast();
      return;
    }

    setState("loading");

    try {
      await contactService.sendMessage(formData);

      setFormData({ name: "", email: "", subject: "", message: "" });

      setErrors({ name: "", email: "", message: "" });

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
            required
            value={formData.name}
            onChange={handleChange}
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
            required
            value={formData.email}
            onChange={handleChange}
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
            required
            value={formData.message}
            onChange={handleChange}
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
