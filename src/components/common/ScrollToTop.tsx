import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
  const { pathname } = useLocation();// Get the current pathname from the location object

  // Scroll to the top of the page whenever the pathname changes

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
