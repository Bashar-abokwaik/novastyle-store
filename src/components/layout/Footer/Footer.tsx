import styles from "./Footer.module.css";
import type { FooterLinks } from "../../../types/index";

const footerLinks: FooterLinks = {
  company: ["About Us", "Careers", "Press"],
  support: ["Contact Us", "FAQ", "Shipping & Returns"],
  social: ["Facebook", "Instagram", "Twitter", "TikTok"],
};

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div>
          <h3 className={styles.sectionTitle}>Company</h3>
          <ul className={styles.linkList}>
            {footerLinks.company.map((link, i) => (
              <li key={i} className={styles.linkItem}>
                <a href="#" className={styles.link}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Support</h3>
          <ul className={styles.linkList}>
            {footerLinks.support.map((link, i) => (
              <li key={i} className={styles.linkItem}>
                <a href="#" className={styles.link}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className={styles.sectionTitle}>Follow Us</h3>
          <ul className={styles.socialList}>
            {footerLinks.social.map((link, i) => (
              <li key={i}>
                <a href="#" className={styles.link}>
                  {link}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className={styles.bottom}>
        &copy; {new Date().getFullYear()} NovaStyle. All rights reserved.
      </div>
    </footer>
  );
}
