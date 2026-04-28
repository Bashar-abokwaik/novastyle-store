import ContactForm from "../components/ContactPage/ContactForm";
import ContactInfo from "../components/ContactPage/ContactInfo";
import styles from "../components/ContactPage/contact.module.css";

function ContactPage() {
  return (
    <>
      <div className={styles.contactFormContainer}>
        <h1 className={styles.contactTitle}>
          Contact <span className={styles.highlight}>Us</span>
        </h1>
        <p className={styles.contactDescription}>
          We usually reply within 24 hours
        </p>
      </div>
      <div className={styles.contactPage}>
        <ContactInfo />
        <ContactForm />
      </div>
    </>
  );
}

export default ContactPage;
