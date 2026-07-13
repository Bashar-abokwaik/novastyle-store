import styles from "./Footer.module.css";
import { FaLinkedin, FaInstagram, FaFacebook } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

// Define the structure of the footer links, including quick links and explore links, which will be displayed in the footer component.
const footerLinks = {
  quickLinks: [
    { title: "Home", href: "/" },
    { title: "Products", href: "/products" },
    { title: "Offers", href: "/offers" },
    { title: "Collections", href: "/collections" },
    { title: "Contact", href: "/contact" },
  ],

  explore: [
    { title: "Register", href: "/register" },
    { title: "Login", href: "/login" },
    { title: "My Profile", href: "/profile" },
    { title: "My Orders", href: "/orders" },
    { title: "Cart", href: "/cart" },
  ],
};

// Define the Footer component, which renders the footer section of the website. It includes quick links, explore links, social media icons, and a copyright notice.
export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Quick Links */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Quick Links</h3>

          <ul className={styles.linkList}>
            {footerLinks.quickLinks.map((link) => (
              <li key={link.title} className={styles.linkItem}>
                <a href={link.href} className={styles.link}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Explore */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Explore</h3>

          <ul className={styles.linkList}>
            {footerLinks.explore.map((link) => (
              <li key={link.title} className={styles.linkItem}>
                <a href={link.href} className={styles.link}>
                  {link.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Connect</h3>

          <div className={styles.socialList}>
            <a
              href="https://www.linkedin.com/in/bashar-abokwaik/"
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin />
            </a>

            <a
              href="https://www.instagram.com/bashar_5520/"
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.facebook.com/bashar.abokwaik"
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaFacebook />
            </a>

            <a
              href="mailto:basharabokaik@gmail.com"
              className={styles.socialIcon}
              target="_blank"
              rel="noopener noreferrer"
            >
              <MdEmail />
            </a>
          </div>

          <p className={styles.description}>
            Follow NovaStyle for the latest fashion trends and exclusive
            updates.
          </p>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>
          © {new Date().getFullYear()} NovaStyle. All rights reserved.
        </span>

        <span className={styles.developer}>
          Designed & Developed by <strong>Bashar Abokwaik</strong>
        </span>
      </div>
    </footer>
  );
}
