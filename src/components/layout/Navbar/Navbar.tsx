import { useState } from "react";

import { useQuery } from "@tanstack/react-query";
import { userService } from "../../../services/userService";
import { NavLink, useNavigate } from "react-router-dom";

import { FaShoppingBag, FaBars, FaUserCircle } from "react-icons/fa";
import { FaSun, FaMoon } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../features/theme/themeSlice";
import { logout } from "../../../features/auth/authSlice";
import { selectCartCount } from "../../../features/cart/cartSlice";

import type { RootState } from "../../../app/store";

import styles from "./Navbar.module.css";

import type { User } from "../../../types/index";

// Define the structure of the response expected from the user profile API
interface GetUserResponse {
  message: string;
  user: User;
}

// Cart Icon Component
const CartIcon = () => <FaShoppingBag size={22} className={styles.cartIcon} />;

// Function to determine the class for NavLink based on active state
const navLinkClass = ({ isActive }: { isActive: boolean }) => {
  return isActive ? `${styles.navLink} ${styles.active}` : styles.navLink;
};

export default function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false); // State to track mobile menu open/close
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const dispatch = useDispatch(); // Redux dispatch function
  const mode = useSelector((state: RootState) => state.theme.mode); // Get current theme mode from Redux store
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.token !== null,
  ); // Get authentication status from Redux store
  const cartCount = useSelector(selectCartCount); // Get cart count from Redux store

  // Use React Query to fetch user profile data if the user is authenticated
  const { data } = useQuery<GetUserResponse>({
    queryKey: ["user"],
    queryFn: async (): Promise<GetUserResponse> => {
      const response = await userService.getUserProfile();
      return response as GetUserResponse;
    },
    enabled: isAuthenticated, // Only run the query if the user is authenticated
  });

  // Function to toggle the mobile menu
  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };
  // Function to toggle the user menu
  const toggleUserMenu = () => {
    setUserMenuOpen((prev) => !prev);
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
          {isAuthenticated ? (
            <NavLink to="/cart" className={styles.cart}>
              <span className={styles.cartCount}>{cartCount}</span>
              <CartIcon />
            </NavLink>
          ) : (
            <NavLink to="/register" className={styles.cart}>
              <CartIcon />
            </NavLink>
          )}
          <button
            className={styles.themeToggle}
            onClick={() => dispatch(toggleTheme())}
          >
            {mode === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </button>
          {isAuthenticated ? (
            <div className={styles.userMenuWrapper}>
              <button className={styles.userMenuBtn} onClick={toggleUserMenu}>
                <FaUserCircle size={22} />
              </button>

              {userMenuOpen && (
                <div className={styles.userDropdown}>
                  <NavLink to="/profile" onClick={toggleUserMenu}>
                    My Profile
                  </NavLink>

                  <NavLink to="/orders" onClick={toggleUserMenu}>
                    My Orders
                  </NavLink>

                  {data?.user.role === "admin" && (
                    <NavLink to="/admin/dashboard" onClick={toggleUserMenu}>
                      Admin Dashboard
                    </NavLink>
                  )}

                  <button
                    onClick={() => {
                      localStorage.removeItem("token");
                      dispatch(logout());
                      navigate("/");
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <NavLink to="/login" className={styles.authBtn}>
              Login/Sign Up
            </NavLink>
          )}

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
                {!isAuthenticated && (
                  <NavLink
                    to="/login"
                    className={styles.authBtn}
                    onClick={() => {
                      toggleMenu();
                      navigate("/login");
                    }}
                  >
                    Login / Sign Up
                  </NavLink>
                )}
              </li>
            </ul>
          </div>
        </>
      )}
    </>
  );
}
