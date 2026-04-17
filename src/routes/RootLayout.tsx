import { Outlet } from "react-router-dom";

import Navbar from "../components/layout/Navbar/Navbar";
import Footer from "../components/layout/Footer/Footer";

function RootLayout() {
  return (
    <>
      <Navbar />
        <Outlet />
      <Footer />
    </>
  );
}

export default RootLayout;
