import { useState } from "react";

import { NavLink } from "react-router-dom";

import { FaShoppingBag, FaBars } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../features/theme/themeSlice";

import type { RootState } from "../../../app/store";

import styles from "./Navbar.module.css";

const CartIcon = () => <FaShoppingBag size={22} className={styles.cartIcon} />;

const navLinkClass = ({ isActive }: { isActive: boolean }) => {
  return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
};

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const mode = useSelector((state: RootState) => state.theme.mode);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
      <nav className={styles.navbar}>
        <div className={styles.logo}>
          <NavLink to="/">NovaStyle</NavLink>
        </div>
        <ul className={styles.navLinks}>
          <li>
            <NavLink to="/" className={navLinkClass}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to="/products" className={navLinkClass}>
              Products
            </NavLink>
          </li>
          <li>
            <NavLink to="/offers" className={navLinkClass}>
              Offers
            </NavLink>
          </li>
          <li>
            <NavLink to="/contact" className={navLinkClass}>
              Contact
            </NavLink>
          </li>
        </ul>
        <div className={styles.rightSection}>
          <NavLink to="/cart" className={styles.cart}>
            <span className={styles.cartCount}>3</span>
            <CartIcon />
          </NavLink>
          <button
            className={styles.themeToggle}
            onClick={() => dispatch(toggleTheme())}
          >
            {mode === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
          <NavLink to="/login" className={styles.authBtn}>
            Login/Sign Up
          </NavLink>
          {/* HAMBURGER */}
          <button className={styles.hamburger} onClick={toggleMenu}>
            <FaBars size={22} />
          </button>
        </div>
      </nav>
      {/* MOBILE MENU */}
      {menuOpen && (
        <>
          {/* Overlay */}
          <div className={styles.overlay} onClick={toggleMenu}></div>

          {/* Menu */}
          <div className={styles.mobileMenu}>
            <ul>
              <li>
                <NavLink to="/" className={navLinkClass} onClick={toggleMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/products"
                  className={navLinkClass}
                  onClick={toggleMenu}
                >
                  Products
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/offers"
                  className={navLinkClass}
                  onClick={toggleMenu}
                >
                  Offers
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/contact"
                  className={navLinkClass}
                  onClick={toggleMenu}
                >
                  Contact
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/login"
                  className={styles.authBtn}
                  onClick={toggleMenu}
                >
                  Login / Sign Up
                </NavLink>
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
