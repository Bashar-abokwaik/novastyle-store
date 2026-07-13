import { NavLink } from "react-router-dom";
import styles from "./adminSidebar.module.css";
import { FaSun, FaMoon } from "react-icons/fa";

import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../../../features/theme/themeSlice";
import type { RootState } from "../../../app/store";
import {
  LayoutDashboard,
  Users,
  ShoppingBag,
  Home,
  Package,
  Tags,
  Layers,
  Mail,
} from "lucide-react";

// Define the AdminSidebar component, which renders the sidebar navigation for the admin panel, including links to various admin pages and a theme toggle button.
export default function AdminSidebar() {
  const dispatch = useDispatch(); // Redux dispatch function
  const mode = useSelector((state: RootState) => state.theme.mode); // Get current theme mode from Redux store

  return (
    <aside className={styles.sidebar}>
      <h2 className={styles.logo}>
        <NavLink to="/">NovaStyle</NavLink>
      </h2>

      <nav className={styles.nav}>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Home size={18} />
          Home
        </NavLink>
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <LayoutDashboard size={18} />
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/users"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Users size={18} />
          Users
        </NavLink>

        <NavLink
          to="/admin/orders"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <ShoppingBag size={18} />
          Orders
        </NavLink>

        <NavLink
          to="/admin/categories"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Tags size={18} />
          Categories
        </NavLink>

        <NavLink
          to="/admin/collections"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Layers size={18} />
          Collections
        </NavLink>

        <NavLink
          to="/admin/products"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Package size={18} />
          Products
        </NavLink>
        <NavLink
          to="/admin/newsletter"
          className={({ isActive }) =>
            isActive ? `${styles.link} ${styles.active}` : styles.link
          }
        >
          <Mail size={18} />
          Newsletter
        </NavLink>
      </nav>
      <div className={styles.themeToggleWrapper}>
        <button
          className={styles.themeToggle}
          onClick={() => dispatch(toggleTheme())}
        >
          Theme{" "}
          <span className={styles.themeIcon}>
            {mode === "light" ? <FaMoon size={18} /> : <FaSun size={18} />}
          </span>
        </button>
      </div>
    </aside>
  );
}
