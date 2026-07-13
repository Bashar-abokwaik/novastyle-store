import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";
import ScrollToTop from "../components/common/ScrollToTop";
import { useEffect } from "react";
import { useCart } from "../hooks/useCart";
import { useSelector } from "react-redux";
import type { RootState } from "../app/store";

function RootLayout() {
  // Destructure the refreshCart function from the useCart hook to manage the user's cart state.
  const { refreshCart } = useCart();
  // Get the authentication token from the Redux store to determine if the user is logged in.
  const token = useSelector((state: RootState) => state.auth.token);

  // useEffect hook to refresh the cart whenever the authentication token changes, ensuring the cart is up-to-date for logged-in users.
  useEffect(() => {
    if (token) {
      refreshCart();
    }
  }, [token, refreshCart]);
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
