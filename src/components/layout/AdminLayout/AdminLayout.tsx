import AdminSidebar from "../../admin/AdminSidebar/AdminSidebar";
import { Outlet } from "react-router-dom";
import styles from "./adminLayout.module.css";
import ScrollToTop from "../../common/ScrollToTop";

export default function AdminLayout() {
  return (
    <section className={styles.container}>
      <AdminSidebar />
      <ScrollToTop />
      <div className={styles.content}>
        <Outlet />
      </div>
    </section>
  );
}